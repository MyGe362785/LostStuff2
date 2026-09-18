-- This project does not grant table privileges to anon/authenticated by default,
-- so most RLS policies from earlier migrations never took effect: signed-in users
-- were stopped by "permission denied" before RLS ran (profile load, claims, image
-- records, staff moderation). Grant only what those policies are written for.

-- The API roles never need these, and TRUNCATE bypasses RLS entirely.
revoke truncate, trigger, references on all tables in schema public from anon, authenticated;

grant select on table public.profiles to authenticated;
-- Owners edit pending items and staff moderate; inserts stay on create_item_with_contact.
grant update on table public.items to authenticated;
grant select on table public.item_contacts to authenticated;
grant insert, delete on table public.item_images to authenticated;
grant select, insert, update on table public.claims to authenticated;
grant select, insert, update on table public.notifications to authenticated;
grant select, insert on table public.audit_events to authenticated;

-- The app only reads the signed-in user's own profile, so stop exposing every
-- student's display name and role to all signed-in users.
drop policy if exists "profiles are readable by signed-in users" on public.profiles;
create policy "users read own profile and staff read all" on public.profiles
for select to authenticated
using (id = (select auth.uid()) or public.is_staff());

-- Trigger-only SECURITY DEFINER function flagged by the Security Advisor. Triggers
-- do not check EXECUTE when they fire, so no caller needs it.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
