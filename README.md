# LostStuff2

## Backend setup

The project is ready to use Supabase for authentication, database storage, private contact data, image uploads, and claims.

1. Create a Supabase project.
2. Run every SQL file in `supabase/migrations/` in order in the Supabase SQL Editor.
3. Copy `.env.example` to `.env.local` and set the project URL and publishable key.
4. Deploy the frontend to Vercel and add the same two environment variables in its project settings. Optionally set `VITE_ALLOWED_EMAIL_DOMAINS` to a comma-separated list (for example `university.ac.th`) as a sign-in form guard for your institution.

Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` belong in the browser. Never expose a Supabase service-role key in Vite or Vercel frontend variables.

Until `.env.local` is configured, the existing localStorage demo remains available.
