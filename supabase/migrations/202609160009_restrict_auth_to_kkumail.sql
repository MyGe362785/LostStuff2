-- Keep the allowed domain list in the database so the Auth hook and RLS policies
-- share one server-side source of truth. The app is intentionally seeded with only
-- Khon Kaen University mail for this phase.
create table if not exists public.allowed_email_domains (
  domain text primary key check (domain = lower(trim(domain))),
  created_at timestamptz not null default now()
);

alter table public.allowed_email_domains enable row level security;
revoke all on table public.allowed_email_domains from anon, authenticated, public;

insert into public.allowed_email_domains (domain)
values ('kkumail.com')
on conflict (domain) do nothing;

create or replace function public.is_allowed_email_domain(p_email text)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select lower(trim(coalesce(p_email, ''))) ~ '^[^@[:space:]]+@[^@[:space:]]+$'
    and exists (
      select 1
      from public.allowed_email_domains
      where domain = lower(split_part(trim(p_email), '@', 2))
    );
$$;

create or replace function public.is_kkumail_user()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select public.is_allowed_email_domain(auth.jwt() ->> 'email');
$$;

revoke all on function public.is_allowed_email_domain(text) from public;
revoke all on function public.is_kkumail_user() from public;
grant execute on function public.is_kkumail_user() to authenticated;

-- Supabase Auth calls this before inserting auth.users. Enable it in
-- Authentication > Hooks > Before User Created after applying this migration.
create or replace function public.hook_restrict_signup_to_kkumail(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_allowed_email_domain(event -> 'user' ->> 'email') then
    return jsonb_build_object(
      'error',
      jsonb_build_object(
        'http_code', 403,
        'message', 'Only @kkumail.com email addresses are allowed to sign up.'
      )
    );
  end if;

  return '{}'::jsonb;
end;
$$;

revoke all on function public.hook_restrict_signup_to_kkumail(jsonb) from public;
grant execute on function public.hook_restrict_signup_to_kkumail(jsonb) to supabase_auth_admin;

-- Existing accounts from another domain cannot use data or uploads, even if they
-- obtained a session before the signup hook was introduced.
create policy "only approved email domains access profiles" on public.profiles
as restrictive for all to authenticated
using (public.is_kkumail_user())
with check (public.is_kkumail_user());

create policy "only approved email domains access items" on public.items
as restrictive for all to authenticated
using (public.is_kkumail_user())
with check (public.is_kkumail_user());

create policy "only approved email domains access item contacts" on public.item_contacts
as restrictive for all to authenticated
using (public.is_kkumail_user())
with check (public.is_kkumail_user());

create policy "only approved email domains access item images" on public.item_images
as restrictive for all to authenticated
using (public.is_kkumail_user())
with check (public.is_kkumail_user());

create policy "only approved email domains access claims" on public.claims
as restrictive for all to authenticated
using (public.is_kkumail_user())
with check (public.is_kkumail_user());

create policy "only approved email domains access notifications" on public.notifications
as restrictive for all to authenticated
using (public.is_kkumail_user())
with check (public.is_kkumail_user());

create policy "only approved email domains access audit events" on public.audit_events
as restrictive for all to authenticated
using (public.is_kkumail_user())
with check (public.is_kkumail_user());

create policy "only approved email domains access image uploads" on storage.objects
as restrictive for all to authenticated
using (public.is_kkumail_user())
with check (public.is_kkumail_user());

-- SECURITY DEFINER functions bypass table RLS, so enforce the same check here.
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
  new_item_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required';
  end if;

  if not public.is_kkumail_user() then
    raise exception 'Only @kkumail.com email addresses are allowed';
  end if;

  insert into public.items (
    owner_id, type, status, category, title_th, title_en, description_th, description_en,
    color, brand, distinctive_marks, building_id, location_detail_th, location_detail_en,
    occurred_on, occurred_time_range, handover_point_th, handover_point_en
  ) values (
    auth.uid(), p_type, 'pending_review', p_category, p_title_th, p_title_en, p_description_th, p_description_en,
    p_color, p_brand, p_distinctive_marks, p_building_id, p_location_detail_th, p_location_detail_en,
    p_occurred_on, p_occurred_time_range, p_handover_point_th, p_handover_point_en
  ) returning id into new_item_id;

  insert into public.item_contacts (item_id, contact) values (new_item_id, p_contact);
  return new_item_id;
end;
$$;
