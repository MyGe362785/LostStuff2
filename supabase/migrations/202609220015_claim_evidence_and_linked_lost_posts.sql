-- Private ownership-claim evidence and links to the claimant's earlier lost
-- report. Evidence objects are uploaded only by the Edge Function after it
-- inspects the file bytes; the database then associates only the caller's
-- objects with their claim.

alter table public.claims
  add column if not exists linked_lost_item_id uuid
    references public.items(id) on delete set null;

create index if not exists claims_linked_lost_item_idx
  on public.claims (linked_lost_item_id)
  where linked_lost_item_id is not null;

create table if not exists public.claim_evidence (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid not null references public.claims(id) on delete cascade,
  storage_path text not null unique,
  created_at timestamptz not null default now(),
  constraint claim_evidence_storage_path_shape check (
    storage_path ~ '^[0-9a-fA-F-]{36}/[0-9a-fA-F-]{36}\.(jpg|png|webp)$'
  )
);

create index if not exists claim_evidence_claim_id_idx on public.claim_evidence (claim_id);

alter table public.claim_evidence enable row level security;
revoke all on table public.claim_evidence from anon, public, authenticated;
grant select on table public.claim_evidence to authenticated;

create policy "claimants and staff read claim evidence" on public.claim_evidence
for select to authenticated using (
  public.is_kkumail_user()
  and exists (
    select 1 from public.claims
    where claims.id = claim_id
      and (claims.claimant_id = auth.uid() or public.is_staff())
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'claim-evidence',
  'claim-evidence',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = false,
    file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

-- There is intentionally no authenticated INSERT policy: uploads go through
-- upload-claim-evidence, which verifies the image signature before it writes.
create policy "claimants and staff read private claim evidence" on storage.objects
for select to authenticated using (
  bucket_id = 'claim-evidence'
  and public.is_kkumail_user()
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_staff())
);

create policy "claimants remove their unsubmitted claim evidence" on storage.objects
for delete to authenticated using (
  bucket_id = 'claim-evidence'
  and public.is_kkumail_user()
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Replace the former three-argument RPC so there is no old RPC endpoint that
-- can bypass linked-post and evidence validation.
drop function if exists public.create_claim(uuid, text, text);

create function public.create_claim(
  p_item_id uuid,
  p_proof text,
  p_preferred_contact text,
  p_evidence_paths text[] default '{}'::text[],
  p_linked_lost_item_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public, storage, pg_temp
as $$
declare
  v_item public.items%rowtype;
  v_linked_lost_item public.items%rowtype;
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

  -- The target must remain a published, available found-item report.
  select * into v_item from public.items where id = p_item_id for update;
  if not found then
    raise exception 'Item not found' using errcode = 'P0002';
  end if;
  if v_item.owner_id = auth.uid() or v_item.type <> 'found' or v_item.status <> 'searching' then
    raise exception 'Only available found-item posts can receive an ownership claim' using errcode = '55000';
  end if;

  if p_linked_lost_item_id is not null then
    select * into v_linked_lost_item from public.items where id = p_linked_lost_item_id;
    if not found
       or v_linked_lost_item.owner_id <> auth.uid()
       or v_linked_lost_item.type <> 'lost'
       or v_linked_lost_item.status not in ('pending_review', 'searching', 'matched')
    then
      raise exception 'The linked post must be one of your active lost-item posts' using errcode = '42501';
    end if;
  end if;

  -- Paths must be objects in this claimant's folder. The Edge Function writes
  -- a server-derived MIME type, while the private bucket also enforces type
  -- and 5 MB limits at storage level.
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

  insert into public.claims (item_id, claimant_id, proof, preferred_contact, linked_lost_item_id)
  values (
    p_item_id,
    auth.uid(),
    trim(p_proof),
    trim(p_preferred_contact),
    p_linked_lost_item_id
  )
  returning id into v_claim_id;

  insert into public.claim_evidence (claim_id, storage_path)
  select v_claim_id, evidence_path
  from unnest(v_evidence_paths) as evidence_path;

  return v_claim_id;
end;
$$;

revoke all on function public.create_claim(uuid, text, text, text[], uuid) from public, anon;
grant execute on function public.create_claim(uuid, text, text, text[], uuid) to authenticated;

notify pgrst, 'reload schema';
