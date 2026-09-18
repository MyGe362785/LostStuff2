# LostStuff2

## Backend setup

The project is ready to use Supabase for authentication, database storage, private contact data, image uploads, and claims.

1. Create a Supabase project.
2. Run every SQL file in `supabase/migrations/` in order in the Supabase SQL Editor.
3. In **Authentication → Hooks → Before User Created**, enable the PostgreSQL hook `public.hook_restrict_signup_to_kkumail`. This is the server-side rule that permits only `@kkumail.com` accounts.
4. Copy `.env.example` to `.env.local` and set the project URL and publishable key.
5. Deploy the frontend to Vercel and add the same two environment variables in its project settings.

Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` belong in the browser. Never expose a Supabase service-role key in Vite or Vercel frontend variables. The sign-in page also checks the `@kkumail.com` format, while the Auth hook and RLS policies enforce the rule server-side.

Until `.env.local` is configured, the existing localStorage demo remains available.
test
