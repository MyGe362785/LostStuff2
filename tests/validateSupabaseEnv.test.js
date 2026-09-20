import { describe, expect, it } from 'vitest'
import { validateSupabaseEnv } from '../config/validateSupabaseEnv.js'

const valid = {
  VITE_SUPABASE_URL: 'https://project.supabase.co',
  VITE_SUPABASE_PUBLISHABLE_KEY: `sb_publishable_${'a'.repeat(24)}`,
}

describe('production Supabase configuration', () => {
  it('accepts an HTTPS URL and publishable key', () => {
    expect(validateSupabaseEnv(valid)).toEqual([])
  })

  it('fails closed when configuration is missing', () => {
    expect(validateSupabaseEnv({})).toEqual(expect.arrayContaining([
      'VITE_SUPABASE_URL is required',
      'VITE_SUPABASE_PUBLISHABLE_KEY is required',
    ]))
  })

  it('rejects insecure URLs and secret keys', () => {
    const errors = validateSupabaseEnv({
      VITE_SUPABASE_URL: 'http://project.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: `sb_secret_${'x'.repeat(32)}`,
    })
    expect(errors.join(' ')).toContain('HTTPS')
    expect(errors.join(' ')).toContain('secret or service-role')
  })
})
