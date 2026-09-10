-- RLS policies decide which rows are visible; PostgreSQL privileges also need
-- to allow the anonymous visitor role to read the public listing tables.
grant select on table public.items to anon, authenticated;
grant select on table public.item_images to anon, authenticated;
grant execute on function public.is_staff() to anon, authenticated;
