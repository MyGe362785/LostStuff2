-- Repair the staff item-transition RPC and force PostgREST to discover its
-- five-argument signature. This migration is intentionally safe to re-run.
create or replace function public.update_item_status(
  p_item_id uuid,
  p_status public.item_status,
  p_action text,
  p_metadata jsonb default '{}'::jsonb,
  p_expected_status public.item_status default null
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_item public.items%rowtype;
  v_is_staff boolean;
  v_audit_metadata jsonb;
begin
  if auth.uid() is null or not public.is_kkumail_user() then
    raise exception 'An approved authenticated account is required' using errcode = '42501';
  end if;
  if p_metadata is null or jsonb_typeof(p_metadata) <> 'object' or octet_length(p_metadata::text) > 8192 then
    raise exception 'Invalid audit metadata' using errcode = '22023';
  end if;

  select * into v_item from public.items where id = p_item_id for update;
  if not found then
    raise exception 'Item not found' using errcode = 'P0002';
  end if;

  v_is_staff := public.is_staff();
  if p_action = 'item_approved' then
    if not v_is_staff or p_status <> 'searching' then
      raise exception 'Invalid item approval' using errcode = '42501';
    end if;
    if p_metadata <> '{}'::jsonb then
      raise exception 'Item approval does not accept metadata' using errcode = '22023';
    end if;
  elsif p_action = 'item_closed' then
    if not v_is_staff or p_status <> 'closed' then
      raise exception 'Invalid item closure' using errcode = '42501';
    end if;
    if p_metadata <> '{}'::jsonb then
      raise exception 'Item closure does not accept metadata' using errcode = '22023';
    end if;
  elsif p_action = 'return_confirmed' then
    if (not v_is_staff and v_item.owner_id <> auth.uid())
       or p_status <> 'returned' then
      raise exception 'Invalid return confirmation' using errcode = '42501';
    end if;
    if (p_metadata - array['claimant', 'notes']) <> '{}'::jsonb
       or char_length(coalesce(p_metadata ->> 'claimant', '')) > 500
       or char_length(coalesce(p_metadata ->> 'notes', '')) > 2000 then
      raise exception 'Invalid return metadata' using errcode = '22023';
    end if;
  else
    raise exception 'Unknown item action' using errcode = '22023';
  end if;

  if p_expected_status is not null and v_item.status <> p_expected_status then
    return false;
  end if;
  if v_item.status = p_status then
    return false;
  end if;

  if (p_action = 'item_approved' and v_item.status <> 'pending_review')
     or (p_action = 'item_closed' and v_item.status not in ('pending_review', 'searching', 'pending_confirm'))
     or (p_action = 'return_confirmed' and v_item.status not in ('searching', 'pending_confirm')) then
    raise exception 'Invalid item status transition' using errcode = '22023';
  end if;

  update public.items set status = p_status where id = p_item_id;

  if p_status in ('returned', 'closed') then
    update public.claims
    set status = 'rejected',
        reviewed_by = coalesce(reviewed_by, case when v_is_staff then auth.uid() else null end),
        reviewed_at = now(),
        staff_note = coalesce(staff_note, 'Item is no longer available')
    where item_id = p_item_id and status in ('pending', 'approved');
  end if;

  v_audit_metadata := jsonb_build_object(
    'status', p_status,
    'previous_status', v_item.status
  );
  if p_action = 'return_confirmed' then
    v_audit_metadata := v_audit_metadata || jsonb_strip_nulls(jsonb_build_object(
      'claimant', nullif(trim(p_metadata ->> 'claimant'), ''),
      'notes', nullif(trim(p_metadata ->> 'notes'), '')
    ));
  end if;

  insert into public.audit_events (actor_id, item_id, action, metadata)
  values (auth.uid(), p_item_id, p_action, v_audit_metadata);
  return true;
end;
$$;

revoke all on function public.update_item_status(uuid, public.item_status, text, jsonb, public.item_status) from public, anon;
grant execute on function public.update_item_status(uuid, public.item_status, text, jsonb, public.item_status) to authenticated;

-- PostgREST normally refreshes automatically after DDL. Explicitly notify it
-- so projects with a stale schema cache can use the repaired RPC immediately.
notify pgrst, 'reload schema';
