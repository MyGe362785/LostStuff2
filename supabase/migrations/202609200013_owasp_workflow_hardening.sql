-- OWASP workflow hardening
--
-- All protected state transitions now happen in SECURITY DEFINER functions.
-- Client roles keep the minimum column privileges needed for ordinary inserts
-- and read-state updates; RLS remains the row-level boundary.

-- A user may only claim a published found item that they do not own.
drop policy if exists "users submit their own claims" on public.claims;
create policy "users submit eligible claims" on public.claims
for insert to authenticated with check (
  claimant_id = (select auth.uid())
  and status = 'pending'
  and reviewed_by is null
  and reviewed_at is null
  and staff_note is null
  and exists (
    select 1
    from public.items
    where id = item_id
      and owner_id <> (select auth.uid())
      and type = 'found'
      and status = 'searching'
  )
);

-- Image records may only reference an object in the current owner's folder.
drop policy if exists "owners add images to their items" on public.item_images;
create policy "owners add their own images to their items" on public.item_images
for insert to authenticated with check (
  (storage.foldername(storage_path))[1] = (select auth.uid())::text
  and exists (
    select 1 from public.items
    where id = item_id and owner_id = (select auth.uid())
  )
);

-- Defensive size limits. NOT VALID avoids making this forward migration fail on
-- historical rows, while PostgreSQL still enforces each rule for new writes.
alter table public.items
  add constraint items_title_th_length check (char_length(trim(title_th)) between 1 and 200) not valid,
  add constraint items_optional_text_lengths check (
    char_length(coalesce(title_en, '')) <= 200
    and char_length(coalesce(description_th, '')) <= 5000
    and char_length(coalesce(description_en, '')) <= 5000
    and char_length(coalesce(distinctive_marks, '')) <= 1000
    and char_length(coalesce(location_detail_th, '')) between 1 and 500
    and char_length(coalesce(location_detail_en, '')) <= 500
    and char_length(coalesce(brand, '')) <= 120
  ) not valid;

alter table public.item_contacts
  add constraint item_contacts_length check (char_length(trim(contact)) between 1 and 500) not valid;

alter table public.claims
  add constraint claims_text_lengths check (
    char_length(trim(proof)) between 1 and 5000
    and char_length(trim(preferred_contact)) between 1 and 500
    and char_length(coalesce(staff_note, '')) <= 2000
  ) not valid;

alter table public.notifications
  add constraint notifications_text_lengths check (
    char_length(kind) between 1 and 80
    and char_length(title) between 1 and 200
    and char_length(body) between 1 and 2000
  ) not valid;

alter table public.audit_events
  add constraint audit_events_shape check (
    char_length(action) between 1 and 80
    and jsonb_typeof(metadata) = 'object'
    and octet_length(metadata::text) <= 8192
  ) not valid;

-- Audit claim submissions without copying proof or contact details into the log.
create or replace function public.audit_claim_submission()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.audit_events (actor_id, item_id, claim_id, action, metadata)
  values (new.claimant_id, new.item_id, new.id, 'claim_received', '{}'::jsonb);
  return new;
end;
$$;

drop trigger if exists claims_audit_submission on public.claims;
create trigger claims_audit_submission
after insert on public.claims
for each row execute function public.audit_claim_submission();

revoke execute on function public.audit_claim_submission() from public, anon, authenticated;

-- Claim submission also locks the item. This closes the race where a claim
-- could pass an RLS status check just as another transaction returned or closed
-- the item.
create or replace function public.create_claim(
  p_item_id uuid,
  p_proof text,
  p_preferred_contact text
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_item public.items%rowtype;
  v_claim_id uuid;
begin
  if auth.uid() is null or not public.is_kkumail_user() then
    raise exception 'An approved authenticated account is required' using errcode = '42501';
  end if;

  select * into v_item from public.items where id = p_item_id for update;
  if not found then
    raise exception 'Item not found' using errcode = 'P0002';
  end if;
  if v_item.owner_id = auth.uid() or v_item.type <> 'found' or v_item.status <> 'searching' then
    raise exception 'Item is not eligible for a claim' using errcode = '55000';
  end if;

  insert into public.claims (item_id, claimant_id, proof, preferred_contact)
  values (p_item_id, auth.uid(), trim(p_proof), trim(p_preferred_contact))
  returning id into v_claim_id;
  return v_claim_id;
end;
$$;

revoke all on function public.create_claim(uuid, text, text) from public, anon;
grant execute on function public.create_claim(uuid, text, text) to authenticated;

-- Item creation and its audit record are committed atomically. The actor and
-- action are never accepted from the browser.
create or replace function public.create_item_with_contact(
  p_type public.item_type,
  p_category text,
  p_title_th text,
  p_title_en text,
  p_description_th text,
  p_description_en text,
  p_color text,
  p_brand text,
  p_distinctive_marks text,
  p_building_id text,
  p_location_detail_th text,
  p_location_detail_en text,
  p_occurred_on date,
  p_occurred_time_range text,
  p_handover_point_th text,
  p_handover_point_en text,
  p_contact text
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_item_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required' using errcode = '42501';
  end if;
  if not public.is_kkumail_user() then
    raise exception 'Only an approved university email may create reports' using errcode = '42501';
  end if;

  insert into public.items (
    owner_id, type, status, category, title_th, title_en, description_th, description_en,
    color, brand, distinctive_marks, building_id, location_detail_th, location_detail_en,
    occurred_on, occurred_time_range, handover_point_th, handover_point_en
  ) values (
    auth.uid(), p_type, 'pending_review', trim(p_category), trim(p_title_th), nullif(trim(p_title_en), ''),
    nullif(trim(p_description_th), ''), nullif(trim(p_description_en), ''), nullif(trim(p_color), ''),
    nullif(trim(p_brand), ''), nullif(trim(p_distinctive_marks), ''), trim(p_building_id),
    trim(p_location_detail_th), nullif(trim(p_location_detail_en), ''), p_occurred_on,
    nullif(trim(p_occurred_time_range), ''), nullif(trim(p_handover_point_th), ''),
    nullif(trim(p_handover_point_en), '')
  ) returning id into v_item_id;

  insert into public.item_contacts (item_id, contact)
  values (v_item_id, trim(p_contact));

  insert into public.audit_events (actor_id, item_id, action, metadata)
  values (
    auth.uid(), v_item_id, 'report_created',
    jsonb_build_object('type', p_type, 'category', trim(p_category))
  );

  return v_item_id;
end;
$$;

-- The sole client-facing interface for ordinary item status changes. It locks
-- the item, validates role/ownership and the transition, updates related claims,
-- and writes the audit record in the same transaction.
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

-- Serialize claim decisions through the item row. In particular, two staff
-- members cannot approve competing claims for the same item.
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
  v_item_status public.item_status;
begin
  if auth.uid() is null or not public.is_kkumail_user() or not public.is_staff() then
    raise exception 'Only approved-domain staff can review claims' using errcode = '42501';
  end if;
  if p_decision is null or p_decision not in ('approved', 'rejected', 'completed') then
    raise exception 'Unknown decision' using errcode = '22023';
  end if;
  if char_length(coalesce(v_note, '')) > 2000 then
    raise exception 'Staff note is too long' using errcode = '22023';
  end if;
  v_status := p_decision::public.claim_status;

  select * into v_claim from public.claims where id = p_claim_id;
  if not found then
    raise exception 'Claim not found' using errcode = 'P0002';
  end if;

  -- Every review of claims for one item takes the same lock first.
  select status into v_item_status
  from public.items where id = v_claim.item_id for update;
  select * into v_claim
  from public.claims where id = p_claim_id for update;

  if not (
    (v_claim.status = 'pending' and v_status in ('approved', 'rejected'))
    or (v_claim.status = 'approved' and v_status in ('completed', 'rejected'))
  ) then
    raise exception 'Invalid claim transition' using errcode = '22023';
  end if;

  if v_status = 'approved' and v_item_status <> 'searching' then
    raise exception 'Item is no longer available' using errcode = '55000';
  end if;
  if v_status = 'approved' and exists (
    select 1 from public.claims
    where item_id = v_claim.item_id and id <> p_claim_id and status = 'approved'
  ) then
    raise exception 'Another claim is already approved' using errcode = '55000';
  end if;
  if v_status = 'completed' and v_item_status <> 'pending_confirm' then
    raise exception 'Item is no longer awaiting collection' using errcode = '55000';
  end if;

  update public.claims
  set status = v_status, reviewed_by = auth.uid(), reviewed_at = now(),
      staff_note = coalesce(v_note, staff_note)
  where id = p_claim_id;

  if v_status = 'approved' then
    update public.items set status = 'pending_confirm'
    where id = v_claim.item_id and status = 'searching';
  elsif v_status = 'completed' then
    update public.items set status = 'returned'
    where id = v_claim.item_id and status = 'pending_confirm';
    update public.claims
    set status = 'rejected', reviewed_by = auth.uid(), reviewed_at = now(),
        staff_note = coalesce(staff_note, 'Item returned to another claimant')
    where item_id = v_claim.item_id and id <> p_claim_id and status in ('pending', 'approved');
  elsif v_claim.status = 'approved' then
    update public.items set status = 'searching'
    where id = v_claim.item_id and status = 'pending_confirm';
  end if;

  -- The detailed note remains on the access-controlled claim row and is not
  -- duplicated into the audit stream.
  insert into public.audit_events (actor_id, item_id, claim_id, action, metadata)
  values (
    auth.uid(), v_claim.item_id, p_claim_id,
    'claim_' || p_decision,
    jsonb_build_object('decision', p_decision)
  );
end;
$$;

revoke execute on function public.review_claim(uuid, text, text) from public, anon;
grant execute on function public.review_claim(uuid, text, text) to authenticated;

-- Remove table-level mutation capabilities that can bypass the functions or
-- forge protected fields. Regrant only the columns used by normal client flows.
revoke update on table public.items from authenticated;
revoke insert, update on table public.claims from authenticated;
revoke update on table public.notifications from authenticated;
grant update (read_at) on public.notifications to authenticated;
revoke insert on table public.audit_events from authenticated;

-- Defense in depth: these policies are no longer reachable by authenticated
-- clients after the grants above, but removing them prevents accidental broad
-- re-grants from restoring the old bypass.
drop policy if exists "staff manage all items" on public.items;
drop policy if exists "staff review claims" on public.claims;
drop policy if exists "staff write audit events" on public.audit_events;
