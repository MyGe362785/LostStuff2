# LostStuff2

## Backend setup

The project is ready to use Supabase for authentication, database storage, private contact data, image uploads, and claims.

1. Create a Supabase project.
2. Run `supabase/migrations/202609090001_initial_schema.sql` in the Supabase SQL Editor.
3. Copy `.env.example` to `.env.local` and set the project URL and publishable key.
4. Deploy the frontend to Vercel and add the same two environment variables in its project settings.

Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` belong in the browser. Never expose a Supabase service-role key in Vite or Vercel frontend variables.

Until `.env.local` is configured, the existing localStorage demo remains available.
