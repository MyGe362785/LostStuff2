create extension if not exists pgcrypto;

create type public.app_role as enum ('student', 'staff', 'admin');
create type public.item_type as enum ('lost', 'found');
create type public.item_status as enum ('pending_review', 'searching', 'pending_confirm', 'returned', 'closed');
create type public.claim_status as enum ('pending', 'approved', 'rejected', 'completed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role public.app_role not null default 'student',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  type public.item_type not null,
  status public.item_status not null default 'pending_review',
  category text not null,
  title_th text not null,
  title_en text,
  description_th text,
  description_en text,
  color text,
  brand text,
  building_id text not null,
  location_detail_th text not null,
  location_detail_en text,
  occurred_on date not null,
  occurred_time_range text,
  handover_point_th text,
  handover_point_en text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.item_contacts (
  item_id uuid primary key references public.items(id) on delete cascade,
  contact text not null,
  created_at timestamptz not null default now()
);

create table public.item_images (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  storage_path text not null unique,
  alt_text text,
  created_at timestamptz not null default now()
);

create table public.claims (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  claimant_id uuid not null references public.profiles(id) on delete cascade,
  proof text not null,
  preferred_contact text not null,
  status public.claim_status not null default 'pending',
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  staff_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (item_id, claimant_id)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null,
  title text not null,
  body text not null,
  item_id uuid references public.items(id) on delete cascade,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  item_id uuid references public.items(id) on delete set null,
  claim_id uuid references public.claims(id) on delete set null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index items_status_created_at_idx on public.items (status, created_at desc);
create index items_search_idx on public.items (type, category, building_id, occurred_on desc);
create index claims_item_status_idx on public.claims (item_id, status);
create index notifications_recipient_created_at_idx on public.notifications (recipient_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger items_set_updated_at before update on public.items
for each row execute function public.set_updated_at();
create trigger claims_set_updated_at before update on public.claims
for each row execute function public.set_updated_at();

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('staff', 'admin')
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1), 'Student'));
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.items enable row level security;
alter table public.item_contacts enable row level security;
alter table public.item_images enable row level security;
alter table public.claims enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_events enable row level security;

create policy "profiles are readable by signed-in users" on public.profiles
for select to authenticated using (true);

create policy "published items are public" on public.items
for select using (status in ('searching', 'pending_confirm', 'returned') or owner_id = auth.uid() or public.is_staff());
create policy "users create their own pending items" on public.items
for insert to authenticated with check (owner_id = auth.uid() and status = 'pending_review');
create policy "owners edit pending items" on public.items
for update to authenticated using (owner_id = auth.uid() and status = 'pending_review') with check (owner_id = auth.uid() and status = 'pending_review');
create policy "staff manage all items" on public.items
for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "owners and staff read private contacts" on public.item_contacts
for select to authenticated using (exists (select 1 from public.items where id = item_id and (owner_id = auth.uid() or public.is_staff())));
create policy "owners add contacts for their items" on public.item_contacts
for insert to authenticated with check (exists (select 1 from public.items where id = item_id and owner_id = auth.uid()));
create policy "staff manage contacts" on public.item_contacts
for all to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "item images follow item visibility" on public.item_images
for select using (exists (select 1 from public.items where id = item_id and (status in ('searching', 'pending_confirm', 'returned') or owner_id = auth.uid() or public.is_staff())));
create policy "owners add images to their items" on public.item_images
for insert to authenticated with check (exists (select 1 from public.items where id = item_id and owner_id = auth.uid()));
create policy "owners and staff remove images" on public.item_images
for delete to authenticated using (exists (select 1 from public.items where id = item_id and (owner_id = auth.uid() or public.is_staff())));

create policy "claimants and staff read claims" on public.claims
for select to authenticated using (claimant_id = auth.uid() or public.is_staff());
create policy "users submit their own claims" on public.claims
for insert to authenticated with check (
  claimant_id = auth.uid()
  and status = 'pending'
  and not exists (select 1 from public.items where id = item_id and owner_id = auth.uid())
);
create policy "staff review claims" on public.claims
for update to authenticated using (public.is_staff()) with check (public.is_staff());

create policy "users read their notifications" on public.notifications
for select to authenticated using (recipient_id = auth.uid());
create policy "users mark their notifications read" on public.notifications
for update to authenticated using (recipient_id = auth.uid()) with check (recipient_id = auth.uid());
create policy "staff create notifications" on public.notifications
for insert to authenticated with check (public.is_staff());

create policy "staff read audit events" on public.audit_events
for select to authenticated using (public.is_staff());
create policy "staff write audit events" on public.audit_events
for insert to authenticated with check (public.is_staff());

insert into storage.buckets (id, name, public)
values ('loststuff-images', 'loststuff-images', false)
on conflict (id) do nothing;

create policy "authenticated users upload their own item images" on storage.objects
for insert to authenticated with check (bucket_id = 'loststuff-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "item owners read their uploads" on storage.objects
for select to authenticated using (bucket_id = 'loststuff-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "users delete their own uploads" on storage.objects
for delete to authenticated using (bucket_id = 'loststuff-images' and (storage.foldername(name))[1] = auth.uid()::text);
