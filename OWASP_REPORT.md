# LostStuff2 OWASP Top 10:2025 implementation report

Assessment date: 2026-09-20  
Scope: Vue frontend, npm dependency graph, repository SQL migrations, public Supabase API behavior, and deployment configuration.

This is a focused security assessment, not an OWASP certification or a claim of complete security. Repository findings are separate from deployed-backend verification. Migration `202609200013_owasp_workflow_hardening.sql` must be applied before its controls exist in the hosted project.

## Verification summary

| Area | Status | Evidence |
|---|---|---|
| Repository regression suite | Verified | `npm test`: 3 files, 8 tests passed |
| Dependency advisories | Verified | `npm audit --audit-level=high`: 0 vulnerabilities |
| Tracked high-confidence secrets | Verified | `npm run security:secrets`: passed; `.env` is ignored |
| Production build with configured backend | Verified | `npm run build`: passed |
| Production configuration fail-closed behavior | Verified in tests | Missing/insecure URL, missing key, and secret/service-role key cases are rejected |
| Hosted anonymous permissions | Verified on 2026-09-20 | Anonymous reads of profiles, claims, and audit events were denied; visible items had only `searching`, `pending_confirm`, or `returned` status |
| Hosted student/staff/admin permissions | Blocked | Synthetic account credentials are not configured |
| Hosted migration/settings parity | Blocked | Publishable access cannot apply migrations or inspect Auth hook, OAuth allowlist, database grants, or platform logs |

## Findings register

| ID | Severity | OWASP | Finding and evidence | Remediation | Status |
|---|---:|---|---|---|---|
| F-01 | High | A01, A08, A09, A10 | `updateItemStatus` made an item update and audit insert as separate browser requests. Authenticated staff also had direct `items` update and `audit_events` insert privileges, so protected transitions and audit fields were client-forgeable. | Added transactional `update_item_status`, server-derived actor/action metadata, transition/role/ownership checks, row locking, and removal of direct grants/policies. | Fixed in repository; hosted verification blocked until migration is applied and test accounts are provided. |
| F-02 | High | A07 | `review_claim` was `SECURITY DEFINER` and checked staff role but did not repeat the approved-domain check. A legacy disallowed-domain account with a staff profile could pass the function check. | `review_claim` now requires authentication, approved-domain membership, and staff role. | Fixed in repository; hosted Auth hook and role-change behavior unverified. |
| F-03 | High | A06, A08, A10 | Concurrent reviewers could approve more than one claim while an item was already `pending_confirm`. Direct claim writes also exposed protected review columns, and an RLS-only eligibility check could race a return/close. | Claim submission and review now use item-locking RPCs. Reviews approve only from `searching`, complete only from `pending_confirm`, and settle competing claims. Direct claim insert/update privileges are removed. | Fixed in repository; concurrent hosted test blocked pending accounts/migration. |
| F-04 | Medium | A05 | The simulated mailbox rendered persisted HTML with `v-html`; report and claim values are interpolated into some message bodies, creating a stored-XSS path in demo mode. A separate `innerHTML` assignment was constant-derived but kept an unnecessary sink. | Removed both HTML sinks. Legacy message markup is parsed to plain text and displayed through Vue text interpolation; the survey banner is built with DOM nodes and `textContent`. | Fixed and regression-tested. |
| F-05 | High | A02, A04 | A production build silently accepted missing backend configuration and could deploy the local demo. | Production Vite builds now validate HTTPS URL and a publishable/legacy-anon key and reject secret/service-role keys. Local development still supports demo mode. | Fixed and regression-tested. |
| F-06 | Medium | A02, A04, A05 | Deployment configuration lacked browser security headers. | Added CSP, HSTS, frame denial, MIME sniffing protection, referrer policy, permissions policy, COOP, and CORP headers. | Fixed in repository; response headers must be checked after deployment. |
| F-07 | Medium | A01, A08 | An item-image row was authorized by item ownership but did not prove the referenced storage path belonged to the same user. | Image insert policy now requires the first storage folder segment to equal `auth.uid()`. | Fixed in repository; hosted bypass test blocked pending accounts/migration. |
| F-08 | Medium | A06, A09 | Claims could be submitted against non-claimable item states/types, and report/claim submission did not always create a trustworthy audit event. | Claim policy now requires another user's published `found` item. Server-side report creation and a claim trigger write redacted audit events atomically. | Fixed in repository; hosted workflow verification blocked. |
| F-09 | Medium | A02, A03 | No repeatable tests, advisory scan, or tracked-secret check existed in CI. | Added Vitest regression coverage, staging integration script, npm audit and secret scan commands, and a least-privilege GitHub Actions workflow. | Fixed and locally verified. |
| F-10 | Low | A10 | Unbounded user and metadata text increased exceptional-condition and operational risk. | Added forward-safe database size/shape checks and RPC metadata allowlists. | Fixed in repository; existing historical rows are intentionally not validated by this migration. |

## OWASP category disposition

| Category | Status | Notes |
|---|---|---|
| A01 Broken Access Control | Finding remediated in repository; partial hosted verification | Anonymous boundary verified. Cross-user, staff, admin, image, and direct-write checks await synthetic accounts and the new migration. |
| A02 Security Misconfiguration | Finding remediated in repository; hosted settings blocked | Build validation and headers are present. Confirm the Auth hook, Google redirect allowlist, migration order, and deployed headers with project access. |
| A03 Software Supply Chain Failures | Verified | Locked dependency audit reports zero known vulnerabilities. CI repeats audit and secret checks. Review dependency updates continuously. |
| A04 Cryptographic Failures | Partially verified | No secret/service-role key is tracked or accepted by the frontend validator; signed image URLs expire after one hour; HSTS is configured. Hosted TLS/session protection settings remain provider-controlled and unverified. |
| A05 Injection | Finding remediated | Vue interpolation is used for user text and the only raw HTML rendering sink was removed. SQL access uses parameterized Supabase calls and typed functions. |
| A06 Insecure Design | Finding remediated in repository; process controls remain | Claimability and competing approvals are enforced server-side. Human ownership-proof quality and abuse monitoring require an operational policy. |
| A07 Authentication Failures | Finding remediated in repository; hosted settings blocked | Privileged functions repeat the domain check. Google OAuth configuration, Before User Created hook enablement, session expiry, and role-removal behavior require project access/test accounts. |
| A08 Software or Data Integrity Failures | Finding remediated in repository | Protected transitions, review fields, notification read state, image ownership, and audit attribution are narrowed to server-controlled or column-scoped paths. |
| A09 Security Logging and Alerting Failures | Finding remediated in repository; alerting blocked | Reports, claims, claim decisions, and item transitions produce database audit events without copying claim proof. Supabase Auth/platform alert configuration and logs require project-owner access. |
| A10 Mishandling of Exceptional Conditions | Finding remediated in repository; hosted concurrency blocked | Status+audit writes and claim decisions are transactional and row-locked; duplicate expected-state changes return `false`; the existing upload cleanup path remains in place. Remote failure/concurrency testing awaits accounts. |

## Staging completion checklist

1. Apply every migration through `202609200013_owasp_workflow_hardening.sql` to staging.
2. Confirm `public.hook_restrict_signup_to_kkumail` is enabled as the Before User Created Auth hook.
3. Confirm Google OAuth redirect URLs contain only expected local, staging, and production origins.
4. Add the eight `SECURITY_*` email/password variables for four synthetic accounts to an untracked local env file.
5. Run `npm run test:security:integration`. A missing account configuration exits as blocked rather than passing.
6. Deploy and inspect the actual response headers, authentication logs/alerts, private bucket configuration, and signed URL expiry.
7. Re-run `npm run security:check` before production rollout.
