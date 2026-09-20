# LostStuff2

## Backend setup

The project is ready to use Supabase for authentication, database storage, private contact data, image uploads, and claims.

1. Create a Supabase project.
2. Run every SQL file in `supabase/migrations/` in order in the Supabase SQL Editor. The OWASP workflow controls are in `202609200013_owasp_workflow_hardening.sql`.
3. In **Authentication → Hooks → Before User Created**, enable the PostgreSQL hook `public.hook_restrict_signup_to_kkumail`. This is the server-side rule that permits only `@kkumail.com` accounts.
4. Copy `.env.example` to `.env.local` and set the project URL and publishable key.
5. Deploy the frontend to Vercel and add the same two environment variables in its project settings.

Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` belong in the browser. Never expose a Supabase service-role key in Vite or Vercel frontend variables. The sign-in page also checks the `@kkumail.com` format, while the Auth hook and RLS policies enforce the rule server-side.

Until `.env.local` is configured, the existing localStorage demo remains available.

Production builds are intentionally fail-closed: `npm run build` requires a valid HTTPS Supabase URL and a publishable (or legacy anon) key. Development mode continues to work without them.

## Security verification

```sh
npm run security:check
npm run build
```

The remote permission/workflow suite requires two synthetic student accounts plus synthetic staff and admin accounts. Put their `SECURITY_*` email/password values from `.env.example` in an untracked `.env.local`, then run:

```sh
npm run test:security:integration
```

The integration command uses only the publishable key and ordinary test accounts. It reports `BLOCKED` when credentials are missing; never use a service-role key. See `OWASP_REPORT.md` for the findings register, current verification status, and staging checklist.
test
