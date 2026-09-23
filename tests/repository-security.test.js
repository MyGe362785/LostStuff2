import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  rpc: vi.fn(),
  getSession: vi.fn(),
  getUser: vi.fn(),
}))

vi.mock('../src/lib/supabase', () => ({
  isBackendConfigured: true,
  supabase: { rpc: mocks.rpc, auth: { getSession: mocks.getSession, getUser: mocks.getUser } },
}))

import { createClaim, DUPLICATE_CLAIM, updateItemStatus } from '../src/services/lostFoundRepository.js'

describe('protected item transitions', () => {
  beforeEach(() => {
    mocks.rpc.mockReset()
    mocks.getSession.mockResolvedValue({ data: { session: { user: { id: 'user-1' } } }, error: null })
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })
  })

  it('uses one transactional RPC and preserves the existing boolean contract', async () => {
    mocks.rpc.mockResolvedValue({ data: true, error: null })
    await expect(updateItemStatus('item-1', 'searching', 'item_approved', {}, { fromStatus: 'pending_review' })).resolves.toBe(true)
    expect(mocks.rpc).toHaveBeenCalledOnce()
    expect(mocks.rpc).toHaveBeenCalledWith('update_item_status', {
      p_item_id: 'item-1',
      p_status: 'searching',
      p_action: 'item_approved',
      p_metadata: {},
      p_expected_status: 'pending_review',
    })
  })

  it('surfaces database denials without attempting a fallback write', async () => {
    const error = Object.assign(new Error('denied'), { code: '42501' })
    mocks.rpc.mockResolvedValue({ data: null, error })
    await expect(updateItemStatus('item-1', 'closed', 'item_closed')).rejects.toBe(error)
    expect(mocks.rpc).toHaveBeenCalledOnce()
  })
})

describe('claim submission', () => {
  beforeEach(() => {
    mocks.rpc.mockReset()
    mocks.getSession.mockResolvedValue({ data: { session: { user: { id: 'user-1' } } }, error: null })
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })
  })

  it('uses the item-locking claim RPC', async () => {
    mocks.rpc.mockResolvedValue({ data: 'claim-1', error: null })
    await expect(createClaim({
      itemId: 'item-1', proof: 'mark', preferredContact: 'email',
      evidencePaths: ['user-1/image.jpg'],
    })).resolves.toMatchObject({
      id: 'claim-1', claimant_id: 'user-1', status: 'pending',
    })
    expect(mocks.rpc).toHaveBeenCalledWith('create_claim', {
      p_item_id: 'item-1', p_proof: 'mark', p_preferred_contact: 'email',
      p_evidence_paths: ['user-1/image.jpg'],
    })
  })

  it('preserves the duplicate-claim error contract', async () => {
    mocks.rpc.mockResolvedValue({ data: null, error: { code: '23505' } })
    await expect(createClaim({ itemId: 'item-1', proof: 'mark', preferredContact: 'email' }))
      .rejects.toMatchObject({ code: DUPLICATE_CLAIM })
  })
})
