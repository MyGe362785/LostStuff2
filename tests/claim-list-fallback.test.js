import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  from: vi.fn(),
  storageFrom: vi.fn(),
  getSession: vi.fn(),
  getUser: vi.fn(),
}))

vi.mock('../src/lib/supabase', () => ({
  isBackendConfigured: true,
  supabase: {
    from: mocks.from,
    storage: { from: mocks.storageFrom },
    auth: { getSession: mocks.getSession, getUser: mocks.getUser },
  },
}))

import { listClaimsForStaff, listMyClaims } from '../src/services/lostFoundRepository.js'

function claimRecord(overrides = {}) {
  return {
    id: 'claim-1',
    item_id: 'item-1',
    claimant_id: 'user-1',
    proof: 'serial number',
    preferred_contact: 'email',
    status: 'pending',
    staff_note: null,
    created_at: '2026-09-24T00:00:00Z',
    reviewed_at: null,
    item: { title_th: 'กระเป๋า', title_en: 'Bag', status: 'searching', type: 'found' },
    ...overrides,
  }
}

function mockClaimQueries(responses) {
  const selects = []
  const orders = vi.fn()
  responses.forEach((response) => orders.mockResolvedValueOnce(response))
  const query = {
    select: vi.fn((columns) => {
      selects.push(columns)
      return query
    }),
    eq: vi.fn(() => query),
    order: orders,
  }
  mocks.from.mockReturnValue(query)
  return { query, selects }
}

describe('claim list schema compatibility', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.getSession.mockResolvedValue({ data: { session: { user: { id: 'user-1' } } }, error: null })
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })
    mocks.storageFrom.mockReturnValue({
      createSignedUrl: vi.fn().mockResolvedValue({ data: { signedUrl: 'https://example.test/evidence' }, error: null }),
    })
  })

  it('retries a personal claim read without evidence when PostgREST lacks the relationship', async () => {
    const missingRelationship = {
      code: 'PGRST200',
      message: "Could not find a relationship between 'claims' and 'claim_evidence' in the schema cache",
    }
    const { query, selects } = mockClaimQueries([
      { data: null, error: missingRelationship },
      { data: [claimRecord()], error: null },
    ])

    await expect(listMyClaims()).resolves.toEqual([
      expect.objectContaining({ id: 'claim-1', evidenceImageUrls: [] }),
    ])
    expect(query.eq).toHaveBeenCalledTimes(2)
    expect(selects[0]).toContain('claim_evidence(storage_path)')
    expect(selects[1]).not.toContain('claim_evidence(storage_path)')
  })

  it('keeps the claimant profile embed when the staff query falls back', async () => {
    const { selects } = mockClaimQueries([
      {
        data: null,
        error: { code: 'PGRST200', details: "relationship between claims and claim_evidence was not found" },
      },
      { data: [claimRecord({ claimant: { display_name: 'Student A' } })], error: null },
    ])

    await expect(listClaimsForStaff()).resolves.toEqual([
      expect.objectContaining({ claimantName: 'Student A', evidenceImageUrls: [] }),
    ])
    expect(selects[1]).toContain('claimant:profiles!claims_claimant_id_fkey(display_name)')
    expect(selects[1]).not.toContain('claim_evidence(storage_path)')
  })

  it('does not hide unrelated database errors', async () => {
    const denied = { code: '42501', message: 'permission denied' }
    const { query } = mockClaimQueries([{ data: null, error: denied }])

    await expect(listMyClaims()).rejects.toBe(denied)
    expect(query.order).toHaveBeenCalledOnce()
  })

  it('signs evidence images from the private evidence bucket', async () => {
    mockClaimQueries([{
      data: [claimRecord({ claim_evidence: [{ storage_path: 'user-1/photo.jpg' }] })],
      error: null,
    }])

    const result = await listMyClaims()

    expect(mocks.storageFrom).toHaveBeenCalledWith('claim-evidence')
    expect(result[0].evidenceImageUrls).toEqual(['https://example.test/evidence'])
  })
})
