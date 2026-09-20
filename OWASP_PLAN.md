# LostStuff2 OWASP Top 10:2025 assessment and fixes

## Summary

**You do not need your friend’s Supabase key to start.** We can review the Vue frontend, dependencies, SQL migrations, database permissions, and security logic now.

The plan uses [OWASP Top 10:2025](https://top10.owasp.org/2025/) and delivers a findings report, fixes, and regression tests. Backend testing will wait for your friend’s staging access, as requested.

## Supabase access needed

| Work | What is needed |
|---|---|
| Review code and SQL; prepare fixes | No Supabase key |
| Test real login, database permissions, uploads, and claims | Staging project URL, publishable key, and test accounts |
| Apply migrations and inspect Auth settings/logs | Appropriate project access, or your friend performs these steps |

Ask your friend for:

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
- A staging project with synthetic data, two student accounts, and staff/admin test accounts.
- Help confirming applied migrations, Google OAuth configuration, and the enabled signup hook.

**Do not request a secret/service-role key for the frontend.** Those keys bypass Row Level Security (RLS), so they are also unsuitable for testing ordinary user permissions. [Supabase documentation](https://supabase.com/docs/guides/getting-started/api-keys)

## Assessment coverage

| OWASP category | Project-specific checks and fixes |
|---|---|
| **A01 Broken Access Control** | Test anonymous, student, staff, and admin access directly through the API. Check private contacts, claims, profiles, notifications, image paths, role escalation, and privileged SQL functions. |
| **A02 Security Misconfiguration** | Fail production builds when Supabase configuration is missing. Review Vercel security headers, OAuth redirect allowlists, Auth hooks, table grants, and private bucket settings. |
| **A03 Software Supply Chain Failures** | Audit the lockfile and dependencies; assess reachable vulnerabilities before upgrading. Add repeatable dependency and secret checks to CI. |
| **A04 Cryptographic Failures** | Verify HTTPS, secret handling, session exposure, and signed-image URL expiry. Confirm hosted protection settings with the project owner. |
| **A05 Injection** | Trace user text into HTML, URLs, and database operations. Test stored XSS through reports, claims, and staff notes. Review the existing `innerHTML` usage without assuming it is exploitable. |
| **A06 Insecure Design** | Review claim eligibility, competing approvals, ownership proof exposure, submission abuse, and upload restrictions. Document missing server-side safeguards. |
| **A07 Authentication Failures** | Test Google sign-in, verified email-domain enforcement, disallowed accounts, expired sessions, logout, and staff access after role changes. |
| **A08 Software or Data Integrity Failures** | Prevent clients from forging review fields, audit actors, or unauthorized status transitions. Verify database constraints and upload-to-item ownership. |
| **A09 Security Logging and Alerting Failures** | Make important actions produce trustworthy database audit records. Check access restrictions, sensitive-data redaction, and available authentication alerts. |
| **A10 Mishandling of Exceptional Conditions** | Test failed uploads, denied requests, interrupted saves, duplicate submissions, and concurrent reviews. Ensure failures cannot leave misleading success states or inconsistent records. |

## Implementation sequence

1. **Establish the baseline now.** Review migrations in order, document effective permissions and data flows, and create a findings register with severity, evidence, remediation, and verification status. Deployed behavior remains “unverified” until tested.

2. **Prepare the initial fixes.**
   - Keep demo mode for local development; require valid backend configuration for production builds.
   - Add the missing approved-domain check to `review_claim`, alongside its staff check.
   - Replace separate item-status and audit requests with one transactional SQL RPC that validates the action and derives the actor from the authenticated user.
   - Restrict direct database writes that would bypass protected transitions or forge audit records.
   - Add deployment security headers and address confirmed dependency or rendering findings.

3. **Add regression coverage.** Use Vitest for frontend/repository behavior and a scripted Supabase integration suite for permissions and workflows. Backend tests must explicitly report missing staging configuration rather than appear to pass.

4. **Verify on staging when access arrives.** Compare deployed policies and settings with the repository, apply new forward migrations, run the tests, and retest confirmed findings before production rollout.

Public listings and existing roles remain supported. Existing repository method signatures should remain stable where possible; the principal backend interface addition is the transactional item-status RPC.

## Acceptance criteria and defaults

- Student A cannot read Student B’s private data or change their records.
- Students cannot promote themselves, review claims, or forge staff/audit fields.
- Disallowed-domain accounts cannot invoke privileged workflows.
- Invalid transitions, duplicate requests, and concurrent reviews preserve consistent item and claim states.
- Upload restrictions hold when frontend checks are bypassed.
- Failed operations produce safe errors; successful status changes include their audit record.
- Production builds fail without backend configuration; normal browsing, login, reporting, and staff workflows still work.
- Every OWASP category has evidence and a status: verified, finding, not applicable with justification, or blocked by missing access.

Use staging and synthetic data for active tests. The final report must clearly separate code-review findings from verified backend results; it should not claim OWASP certification or complete security.
