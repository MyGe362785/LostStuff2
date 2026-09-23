-- Remove the optional lost-post link from ownership claims while preserving
-- private evidence uploads added in the previous migration.

drop function if exists public.create_claim(uuid, text, text, text[], uuid);
drop function if exists public.create_claim(uuid, text, text, text[]);

alter table public.claims
  drop column if exists linked_lost_item_id;

create function public.create_claim(
  p_item_id uuid,
  p_proof text,
  p_preferred_contact text,
  p_evidence_paths text[] default '{}'::text[]
)
returns uuid
language plpgsql
security definer
set search_path = public, storage, pg_temp
as $$
declare
  v_item public.items%rowtype;
  v_claim_id uuid;
  v_evidence_paths text[] := coalesce(p_evidence_paths, '{}'::text[]);
begin
  if auth.uid() is null or not public.is_kkumail_user() then
    raise exception 'An approved authenticated account is required' using errcode = '42501';
  end if;

  if cardinality(v_evidence_paths) > 5
     or exists (select 1 from unnest(v_evidence_paths) as path where path is null or path = '')
     or (select count(*) from (select distinct path from unnest(v_evidence_paths) as path) as unique_paths) <> cardinality(v_evidence_paths)
  then
    raise exception 'Attach at most five distinct evidence images' using errcode = '22023';
  end if;

  select * into v_item from public.items where id = p_item_id for update;
  if not found then
    raise exception 'Item not found' using errcode = 'P0002';
  end if;
  if v_item.owner_id = auth.uid() or v_item.type <> 'found' or v_item.status <> 'searching' then
    raise exception 'Only available found-item posts can receive an ownership claim' using errcode = '55000';
  end if;

  if exists (
    select 1
    from unnest(v_evidence_paths) as evidence_path
    left join storage.objects as object_row
      on object_row.bucket_id = 'claim-evidence'
     and object_row.name = evidence_path
    where object_row.name is null
      or (storage.foldername(evidence_path))[1] <> auth.uid()::text
      or coalesce(object_row.metadata ->> 'mimetype', '') not in ('image/jpeg', 'image/png', 'image/webp')
      or coalesce((object_row.metadata ->> 'size')::bigint, 0) > 5242880
  ) then
    raise exception 'Evidence images are invalid or do not belong to you' using errcode = '42501';
  end if;

  insert into public.claims (item_id, claimant_id, proof, preferred_contact)
  values (p_item_id, auth.uid(), trim(p_proof), trim(p_preferred_contact))
  returning id into v_claim_id;

  insert into public.claim_evidence (claim_id, storage_path)
  select v_claim_id, evidence_path
  from unnest(v_evidence_paths) as evidence_path;

  return v_claim_id;
end;
$$;

revoke all on function public.create_claim(uuid, text, text, text[]) from public, anon;
grant execute on function public.create_claim(uuid, text, text, text[]) to authenticated;

notify pgrst, 'reload schema';
