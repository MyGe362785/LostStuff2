-- Staff approve reports before they are published, so they need to see the
-- uploaded photo while the item is still pending. Owners and published items
-- were already covered by earlier policies.
create policy "staff read item images" on storage.objects
for select to authenticated
using (bucket_id = 'loststuff-images' and public.is_staff());

-- Record who acted on every audit event, including inserts made from the app.
alter table public.audit_events alter column actor_id set default auth.uid();

-- Claims had no review path: students could file one, but nothing let staff
-- see or decide it. This moves the claim and its item forward in one step.
create or replace function public.review_claim(
  p_claim_id uuid,
  p_decision text,
  p_note text default null
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_claim public.claims%rowtype;
  v_status public.claim_status;
  v_note text := nullif(trim(p_note), '');
  v_item_id uuid;
  v_item_status public.item_status;
begin
  if not public.is_staff() then
    raise exception 'Only staff can review claims' using errcode = '42501';
  end if;

  if p_decision is null or p_decision not in ('approved', 'rejected', 'completed') then
    raise exception 'Unknown decision: %', p_decision using errcode = '22023';
  end if;
  v_status := p_decision::public.claim_status;

  select item_id into v_item_id from public.claims where id = p_claim_id;
  if not found then
    raise exception 'Claim not found' using errcode = 'P0002';
  end if;

  -- Lock the item before the claim, so reviews of different claims on the
  -- same item queue up instead of deadlocking.
  select status into v_item_status from public.items where id = v_item_id for update;
  select * into v_claim from public.claims where id = p_claim_id for update;

  -- Claims only move forward: pending to approved or rejected, and approved
  -- to completed or rejected.
  if not (
    (v_claim.status = 'pending' and v_status in ('approved', 'rejected'))
    or (v_claim.status = 'approved' and v_status in ('completed', 'rejected'))
  ) then
    raise exception 'Cannot move a % claim to %', v_claim.status, v_status using errcode = '22023';
  end if;

  -- Staff can return or close an item outside the claim flow; do not promise
  -- a pickup for an item that is already gone.
  if v_status in ('approved', 'completed') and v_item_status not in ('searching', 'pending_confirm') then
    raise exception 'Item is no longer available (status %)', v_item_status using errcode = '55000';
  end if;

  -- Keep the earlier note (for example, pickup instructions) when no new one is given.
  update public.claims
  set status = v_status, reviewed_by = auth.uid(), reviewed_at = now(), staff_note = coalesce(v_note, staff_note)
  where id = p_claim_id;

  if v_status = 'approved' then
    -- Hold the item while the claimant comes to collect it.
    update public.items set status = 'pending_confirm'
    where id = v_claim.item_id and status in ('searching', 'pending_confirm');
  elsif v_status = 'completed' then
    update public.items set status = 'returned' where id = v_claim.item_id;
    -- The item has gone home, so any other open claim on it is settled.
    update public.claims
    set status = 'rejected', reviewed_by = auth.uid(), reviewed_at = now(),
        staff_note = coalesce(staff_note, 'Item returned to another claimant')
    where item_id = v_claim.item_id and id <> p_claim_id and status in ('pending', 'approved');
  elsif v_claim.status = 'approved' then
    -- An approved claim fell through; release the hold unless another claim is approved.
    update public.items set status = 'searching'
    where id = v_claim.item_id and status = 'pending_confirm'
      and not exists (
        select 1 from public.claims where item_id = v_claim.item_id and status = 'approved'
      );
  end if;

  insert into public.audit_events (actor_id, item_id, claim_id, action, metadata)
  values (auth.uid(), v_claim.item_id, p_claim_id, 'claim_' || p_decision, jsonb_build_object('note', v_note));
end;
$$;

revoke execute on function public.review_claim(uuid, text, text) from public, anon;
grant execute on function public.review_claim(uuid, text, text) to authenticated;
