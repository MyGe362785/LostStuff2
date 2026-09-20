// Turns `audit_events` rows into the shape the staff portal's audit table
// already renders for the demo's mock logs.
const ACTIONS = {
  report_created: { th: 'สร้างรายการใหม่', en: 'Report created', badge: 'bg-amber-100 text-amber-800 border-amber-200' },
  claim_received: { th: 'รับคำขอรับคืน', en: 'Claim received', badge: 'bg-purple-100 text-purple-800 border-purple-200' },
  item_approved: { th: 'อนุมัติรายการขึ้นสู่ระบบ', en: 'Item approved', badge: 'bg-blue-100 text-blue-800 border-blue-200' },
  item_closed: { th: 'ไม่อนุมัติ / ปิดเคส', en: 'Rejected / closed', badge: 'bg-red-100 text-red-800 border-red-200' },
  return_confirmed: { th: 'ยืนยันการส่งมอบคืนสำเร็จ', en: 'Return confirmed', badge: 'bg-green-100 text-green-800 border-green-200' },
  claim_approved: { th: 'อนุมัติคำขอรับคืน', en: 'Claim approved', badge: 'bg-purple-100 text-purple-800 border-purple-200' },
  claim_rejected: { th: 'ไม่อนุมัติคำขอรับคืน', en: 'Claim rejected', badge: 'bg-red-100 text-red-800 border-red-200' },
  claim_completed: { th: 'ส่งคืนตามคำขอรับคืน', en: 'Claim completed', badge: 'bg-green-100 text-green-800 border-green-200' },
}

const NEUTRAL_BADGE = 'bg-brand-cream text-brand-chestnut border-brand-sand'

/**
 * @param {{ id: string, action: string, metadata: object | null, created_at: string, item_id: string | null,
 *   actor?: { display_name: string } | null, item?: { title_th: string, title_en: string | null } | null }} record
 */
export function toAuditLogEntry(record) {
  const known = Object.hasOwn(ACTIONS, record.action) ? ACTIONS[record.action] : null
  const metadata = record.metadata || {}
  return {
    id: record.id,
    timestamp: record.created_at,
    // Events written before actor_id had a default have no actor.
    staffName: record.actor?.display_name || '-',
    actionType: record.action,
    actionLabelTh: known?.th || record.action,
    actionLabelEn: known?.en || record.action,
    statusBadgeClass: known?.badge || NEUTRAL_BADGE,
    // Full UUIDs overflow the column; the prefix is enough to find the row.
    itemId: record.item_id ? record.item_id.slice(0, 8) : '-',
    itemTitle: record.item?.title_th || record.item?.title_en || '',
    claimantInfo: metadata.claimant || '',
    notes: metadata.note || metadata.notes || '',
  }
}
