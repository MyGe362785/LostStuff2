import { isBackendConfigured, supabase } from '../lib/supabase'

const IMAGE_BUCKET = 'loststuff-images'
const CLAIM_EVIDENCE_BUCKET = 'claim-evidence'
const MAX_CLAIM_EVIDENCE_IMAGES = 5

const FALLBACK_IMAGE_BY_CATEGORY = {
  electronics: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
  cards_wallets: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80',
  keys_vehicles: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80',
  stationery_books: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80',
  clothing_apparel: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
  personal_items: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&auto=format&fit=crop&q=80',
  others: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
}

function fallbackImageUrl(record) {
  return Object.hasOwn(FALLBACK_IMAGE_BY_CATEGORY, record.category)
    ? FALLBACK_IMAGE_BY_CATEGORY[record.category]
    : FALLBACK_IMAGE_BY_CATEGORY.others
}

function requireBackend() {
  if (!isBackendConfigured || !supabase) throw new Error('Supabase is not configured.')
}

export async function getCurrentUser() {
  requireBackend()
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) throw sessionError
  if (!sessionData.session) return null
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return data.user
}

export async function getCurrentProfile() {
  const user = await getCurrentUser()
  if (!user) return null
  const { data, error } = await supabase.from('profiles').select('id, display_name, role').eq('id', user.id).single()
  if (error) throw error
  return data
}

async function signedImageUrl(storagePath, bucket = IMAGE_BUCKET) {
  if (!storagePath) return null
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(storagePath, 3600)
  return error ? null : data.signedUrl
}

async function mapItem(record, currentUserId) {
  const image = record.item_images?.[0]
  return {
    id: record.id, ownerId: record.owner_id, type: record.type, status: record.status,
    category: record.category, titleTh: record.title_th, titleEn: record.title_en || record.title_th,
    descriptionTh: record.description_th || record.title_th,
    descriptionEn: record.description_en || record.description_th || record.title_th,
    color: record.color, colorNameTh: record.color, colorNameEn: record.color, brand: record.brand,
    distinctiveMarks: record.distinctive_marks,
    buildingId: record.building_id, locationDetailTh: record.location_detail_th,
    locationDetailEn: record.location_detail_en || record.location_detail_th,
    date: record.occurred_on, timeRange: record.occurred_time_range,
    timeDetailTh: record.occurred_time_range || '', timeDetailEn: record.occurred_time_range || '',
    handoverPointTh: record.handover_point_th || 'ศูนย์ประสานงานของหายกลาง',
    handoverPointEn: record.handover_point_en || record.handover_point_th || 'Central Lost & Found Office',
    imageUrl: (await signedImageUrl(image?.storage_path)) || fallbackImageUrl(record),
    createdAt: record.created_at, isMyPost: record.owner_id === currentUserId,
  }
}

export async function listVisibleItems() {
  requireBackend()
  const user = await getCurrentUser()
  const { data, error } = await supabase.from('items').select('*, item_images(storage_path)').order('created_at', { ascending: false })
  if (error) throw error
  return Promise.all(data.map((item) => mapItem(item, user?.id)))
}

/**
 * Upload the photo first, then create the item, so a failed upload leaves
 * nothing behind. Once the item exists the report counts as saved: a failure
 * after that point comes back as `imageError` rather than a throw, because a
 * throw would invite the user to submit a duplicate.
 * @returns {Promise<{ id: string, imageError: Error | null }>}
 */
export async function createItem({ item, imageFile }) {
  requireBackend()
  const user = await getCurrentUser()
  if (!user) throw new Error('Sign in is required before creating a report.')

  let storagePath = null
  if (imageFile) {
    const safeName = imageFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    storagePath = `${user.id}/${crypto.randomUUID()}-${safeName}`
    const { error: uploadError } = await supabase.storage.from(IMAGE_BUCKET).upload(storagePath, imageFile, { contentType: imageFile.type, upsert: false })
    if (uploadError) throw uploadError
  }

  const { data: itemId, error: itemError } = await supabase.rpc('create_item_with_contact', {
    p_type: item.type, p_category: item.category, p_title_th: item.titleTh, p_title_en: item.titleEn,
    p_description_th: item.descriptionTh, p_description_en: item.descriptionEn,
    p_color: item.colorNameTh || item.color, p_brand: item.brand || null,
    p_distinctive_marks: item.distinctiveMarks || null, p_building_id: item.buildingId,
    p_location_detail_th: item.locationDetailTh, p_location_detail_en: item.locationDetailEn,
    p_occurred_on: item.date, p_occurred_time_range: item.timeRange,
    p_handover_point_th: item.handoverPointTh, p_handover_point_en: item.handoverPointEn,
    p_contact: item.reporterContact,
  })
  if (itemError) {
    if (storagePath) await supabase.storage.from(IMAGE_BUCKET).remove([storagePath])
    throw itemError
  }
  if (!storagePath) return { id: itemId, imageError: null }

  const { error: imageError } = await supabase.from('item_images').insert({ item_id: itemId, storage_path: storagePath, alt_text: item.titleTh })
  if (imageError) {
    await supabase.storage.from(IMAGE_BUCKET).remove([storagePath])
    return { id: itemId, imageError }
  }
  return { id: itemId, imageError: null }
}

export const DUPLICATE_CLAIM = 'duplicate_claim'

/**
 * The edge function validates the actual image signature and assigns the MIME
 * type itself. The private bucket has no browser INSERT policy, so a caller
 * cannot bypass that check by calling Storage directly.
 */
export async function uploadClaimEvidence(file) {
  requireBackend()
  const formData = new FormData()
  formData.append('file', file)
  const { data, error } = await supabase.functions.invoke('upload-claim-evidence', { body: formData })
  if (error) throw new Error(data?.error || error.message || 'Could not upload evidence image.')
  if (!data?.path) throw new Error('The evidence upload did not return a file reference.')
  return data.path
}

/** Remove unsubmitted private evidence when the claimant cancels the form. */
export async function removeClaimEvidence(paths) {
  requireBackend()
  if (!paths?.length) return
  const { error } = await supabase.storage.from(CLAIM_EVIDENCE_BUCKET).remove(paths)
  if (error) throw error
}

export async function createClaim({ itemId, proof, preferredContact, evidencePaths = [] }) {
  requireBackend()
  const user = await getCurrentUser()
  if (!user) throw new Error('Sign in is required before submitting a claim.')
  if (evidencePaths.length > MAX_CLAIM_EVIDENCE_IMAGES) throw new Error('Attach no more than five evidence images.')
  const { data, error } = await supabase.rpc('create_claim', {
    p_item_id: itemId,
    p_proof: proof,
    p_preferred_contact: preferredContact,
    p_evidence_paths: evidencePaths,
  })
  // claims has unique (item_id, claimant_id); a second claim on the same item lands here.
  if (error?.code === '23505') throw Object.assign(new Error(DUPLICATE_CLAIM), { code: DUPLICATE_CLAIM })
  if (error) throw error
  return {
    id: data, item_id: itemId, claimant_id: user.id, proof, preferred_contact: preferredContact,
    evidence_paths: evidencePaths, status: 'pending',
  }
}

async function mapClaim(record) {
  const evidenceImageUrls = await Promise.all(
    (record.claim_evidence || []).map((evidence) => signedImageUrl(evidence.storage_path, CLAIM_EVIDENCE_BUCKET))
  )
  return {
    id: record.id,
    itemId: record.item_id,
    claimantId: record.claimant_id,
    claimantName: record.claimant?.display_name || null,
    proof: record.proof,
    preferredContact: record.preferred_contact,
    status: record.status,
    staffNote: record.staff_note,
    createdAt: record.created_at,
    reviewedAt: record.reviewed_at,
    itemTitleTh: record.item?.title_th || null,
    itemTitleEn: record.item?.title_en || record.item?.title_th || null,
    itemStatus: record.item?.status || null,
    itemType: record.item?.type || null,
    handoverPointTh: record.item?.handover_point_th || null,
    handoverPointEn: record.item?.handover_point_en || record.item?.handover_point_th || null,
    evidenceImageUrls: evidenceImageUrls.filter(Boolean),
  }
}

const CLAIM_ITEM_COLUMNS = 'item:items(title_th, title_en, status, type, handover_point_th, handover_point_en)'
const CLAIM_EVIDENCE_COLUMNS = 'claim_evidence(storage_path)'
const CLAIM_BASE_COLUMNS = `id, item_id, claimant_id, proof, preferred_contact, status, staff_note, created_at, reviewed_at, ${CLAIM_ITEM_COLUMNS}`

function isMissingClaimEvidenceRelationship(error) {
  if (error?.code !== 'PGRST200') return false
  const diagnostic = [error.message, error.details, error.hint].filter(Boolean).join(' ').toLowerCase()
  return diagnostic.includes('claims') && diagnostic.includes('claim_evidence')
}

async function selectClaims({ claimantId = null, includeClaimant = false, includeEvidence = true } = {}) {
  const evidenceColumns = includeEvidence ? `, ${CLAIM_EVIDENCE_COLUMNS}` : ''
  const claimantColumns = includeClaimant ? ', claimant:profiles!claims_claimant_id_fkey(display_name)' : ''
  let query = supabase
    .from('claims')
    .select(`${CLAIM_BASE_COLUMNS}${evidenceColumns}${claimantColumns}`)

  if (claimantId) query = query.eq('claimant_id', claimantId)
  return query.order('created_at', { ascending: false })
}

/**
 * Deployments can briefly serve a newer frontend before PostgREST has reloaded
 * the claim-evidence relationship. Claims remain usable without thumbnails, so
 * retry the read without that optional embed instead of breaking the session.
 */
async function selectClaimsWithEvidenceFallback(options) {
  let result = await selectClaims(options)
  if (isMissingClaimEvidenceRelationship(result.error)) {
    result = await selectClaims({ ...options, includeEvidence: false })
  }
  return result
}

/** Every claim, newest first. RLS returns rows only to staff. */
export async function listClaimsForStaff() {
  requireBackend()
  const { data, error } = await selectClaimsWithEvidenceFallback({ includeClaimant: true })
  if (error) throw error
  return Promise.all(data.map(mapClaim))
}

/** The signed-in user's own claims, newest first. */
export async function listMyClaims() {
  requireBackend()
  const user = await getCurrentUser()
  if (!user) return []
  const { data, error } = await selectClaimsWithEvidenceFallback({ claimantId: user.id })
  if (error) throw error
  return Promise.all(data.map(mapClaim))
}

/**
 * Staff decision on a claim; the database moves the item and writes the audit
 * event in the same transaction.
 * @param {{ claimId: string, decision: 'approved' | 'rejected' | 'completed', note?: string }} review
 */
export const ITEM_UNAVAILABLE = 'item_unavailable'

export async function reviewClaim({ claimId, decision, note }) {
  requireBackend()
  const { error } = await supabase.rpc('review_claim', { p_claim_id: claimId, p_decision: decision, p_note: note || null })
  // 55000: the item was returned or closed outside the claim flow.
  if (error?.code === '55000') throw Object.assign(new Error(ITEM_UNAVAILABLE), { code: ITEM_UNAVAILABLE })
  if (error) throw error
}

/**
 * @param {object} [details] extra audit metadata, such as who collected a
 *   returned item and the staff member's notes
 * @param {object} [options]
 * @param {string} [options.fromStatus] only move the item when it still has
 *   this status, so a repeated click cannot write a second audit event
 * @returns {Promise<boolean>} false when the item had already moved on
 */
export async function updateItemStatus(itemId, status, action, details = {}, { fromStatus } = {}) {
  requireBackend()
  const { data, error } = await supabase.rpc('update_item_status', {
    p_item_id: itemId,
    p_status: status,
    p_action: action,
    p_metadata: details,
    p_expected_status: fromStatus || null,
  })
  if (error) throw error
  return data
}

function mapNotification(record) {
  return {
    id: record.id,
    kind: record.kind,
    title: record.title,
    body: record.body,
    itemId: record.item_id,
    readAt: record.read_at,
    createdAt: record.created_at,
  }
}

/** A user's latest notifications, newest first. RLS returns only their own rows. */
export async function listMyNotifications(recipientId, limit = 50) {
  requireBackend()
  const { data, error } = await supabase
    .from('notifications')
    .select('id, kind, title, body, item_id, read_at, created_at')
    .eq('recipient_id', recipientId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data.map(mapNotification)
}

/** RLS lets a user update only notifications addressed to them. */
export async function markNotificationsRead(ids) {
  requireBackend()
  if (ids.length === 0) return
  const { error } = await supabase.from('notifications').update({ read_at: new Date().toISOString() }).in('id', ids)
  if (error) throw error
}

/**
 * Writes notifications addressed to other users; RLS accepts them from staff only.
 * @param {Array<{ recipientId: string, kind: string, itemId?: string, title: string, body: string }>} notifications
 */
export async function sendNotifications(notifications) {
  requireBackend()
  if (notifications.length === 0) return
  const rows = notifications.map(notification => ({
    recipient_id: notification.recipientId,
    kind: notification.kind,
    item_id: notification.itemId || null,
    title: notification.title,
    body: notification.body,
  }))
  const { error } = await supabase.from('notifications').insert(rows)
  if (error) throw error
}

/** Latest audit events with who acted and on which item. RLS returns rows only to staff. */
export async function listAuditEvents(limit = 200) {
  requireBackend()
  const { data, error } = await supabase
    .from('audit_events')
    .select('id, action, metadata, created_at, item_id, actor:profiles!audit_events_actor_id_fkey(display_name), item:items!audit_events_item_id_fkey(title_th, title_en)')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}
