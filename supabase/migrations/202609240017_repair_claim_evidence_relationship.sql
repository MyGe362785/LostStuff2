-- Ensure PostgREST can discover the claims -> claim_evidence embed even when
-- claim_evidence was created manually before migration 015. `create table if
-- not exists` cannot add a missing foreign key to an existing table.

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where contype = 'f'
      and conrelid = 'public.claim_evidence'::regclass
      and confrelid = 'public.claims'::regclass
  ) then
    alter table public.claim_evidence
      add constraint claim_evidence_claim_id_fkey
      foreign key (claim_id) references public.claims(id) on delete cascade;
  end if;
end;
$$;

notify pgrst, 'reload schema';
