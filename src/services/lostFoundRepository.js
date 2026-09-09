import { isBackendConfigured, supabase } from '../lib/supabase'

const IMAGE_BUCKET = 'loststuff-images'

function requireBackend() {
  if (!isBackendConfigured || !supabase) throw new Error('Supabase is not configured.')
}

export async function getCurrentUser() {
  requireBackend()
  const { data, error } = await supabase.auth.getUser()
  if (error?.name === 'AuthSessionMissingError') return null
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

async function signedImageUrl(storagePath) {
  if (!storagePath) return null
  const { data, error } = await supabase.storage.from(IMAGE_BUCKET).createSignedUrl(storagePath, 3600)
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
    imageUrl: (await signedImageUrl(image?.storage_path)) || 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
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

export async function createItem({ item, imageFile }) {
  requireBackend()
  const user = await getCurrentUser()
  if (!user) throw new Error('Sign in is required before creating a report.')
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
  if (itemError) throw itemError
  if (imageFile) {
    const safeName = imageFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const storagePath = `${user.id}/${itemId}/${Date.now()}-${safeName}`
    const { error: uploadError } = await supabase.storage.from(IMAGE_BUCKET).upload(storagePath, imageFile, { contentType: imageFile.type, upsert: false })
    if (uploadError) throw uploadError
    const { error: imageError } = await supabase.from('item_images').insert({ item_id: itemId, storage_path: storagePath, alt_text: item.titleTh })
    if (imageError) {
      await supabase.storage.from(IMAGE_BUCKET).remove([storagePath])
      throw imageError
    }
  }
  return { id: itemId }
}

export async function createClaim({ itemId, proof, preferredContact }) {
  requireBackend()
  const user = await getCurrentUser()
  if (!user) throw new Error('Sign in is required before submitting a claim.')
  const { data, error } = await supabase.from('claims').insert({ item_id: itemId, claimant_id: user.id, proof, preferred_contact: preferredContact }).select().single()
  if (error) throw error
  return data
}

export async function updateItemStatus(itemId, status, action) {
  requireBackend()
  const { error: updateError } = await supabase.from('items').update({ status }).eq('id', itemId)
  if (updateError) throw updateError
  const { error: auditError } = await supabase.from('audit_events').insert({ item_id: itemId, action, metadata: { status } })
  if (auditError) throw auditError
}
