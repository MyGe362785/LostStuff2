import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const migration = readFileSync('supabase/migrations/202609200013_owasp_workflow_hardening.sql', 'utf8')
const rpcRepairMigration = readFileSync('supabase/migrations/202609220014_repair_update_item_status_rpc.sql', 'utf8')

describe('repository security contract', () => {
  it('removes the raw HTML rendering sink', () => {
    const emailComponent = readFileSync('src/components/EmailInboxModal.vue', 'utf8')
    const adminComponent = readFileSync('src/components/AdminPortal.vue', 'utf8')
    expect(emailComponent).not.toMatch(/\bv-html\b/)
    expect(adminComponent).not.toContain('.innerHTML')
  })

  it('revokes direct protected writes and exposes transactional functions', () => {
    expect(migration).toContain('revoke update on table public.items from authenticated')
    expect(migration).toContain('revoke insert, update on table public.claims from authenticated')
    expect(migration).toContain('revoke insert on table public.audit_events from authenticated')
    expect(migration).toContain('create or replace function public.create_claim')
    expect(migration).toContain('create or replace function public.update_item_status')
    expect(migration).toContain('not public.is_kkumail_user() or not public.is_staff()')
  })

  it('repairs and reloads the item status RPC schema contract', () => {
    expect(rpcRepairMigration).toContain('create or replace function public.update_item_status')
    expect(rpcRepairMigration).toContain('p_expected_status public.item_status default null')
    expect(rpcRepairMigration).toContain("notify pgrst, 'reload schema'")
  })

  it('configures deployment hardening headers', () => {
    const config = JSON.parse(readFileSync('vercel.json', 'utf8'))
    const headers = Object.fromEntries(config.headers[0].headers.map(({ key, value }) => [key, value]))
    expect(headers['Content-Security-Policy']).toContain("frame-ancestors 'none'")
    expect(headers['Content-Security-Policy']).toContain('frame-src https://www.google.com https://maps.google.com')
    expect(headers['Strict-Transport-Security']).toContain('max-age=63072000')
    expect(headers['X-Content-Type-Options']).toBe('nosniff')
  })
})
