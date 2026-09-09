import { isBackendConfigured, supabase } from '../lib/supabase'

function requireBackend() {
  if (!isBackendConfigured || !supabase) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.')
  }
}

export async function getCurrentUser() {
  requireBackend()
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return data.user
}

export async function listPublishedItems() {
  requireBackend()
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .in('status', ['searching', 'pending_confirm', 'returned'])
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createClaim({ itemId, proof, preferredContact }) {
  requireBackend()
  const user = await getCurrentUser()
  if (!user) throw new Error('Sign in is required before submitting a claim.')

  const { data, error } = await supabase
    .from('claims')
    .insert({
      item_id: itemId,
      claimant_id: user.id,
      proof,
      preferred_contact: preferredContact,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
