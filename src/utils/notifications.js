// In-app notifications for the Supabase backend. Staff clients write them when
// they publish an item or decide a claim (RLS lets only staff insert), and each
// user reads their own. Rows keep a Thai title and body as a readable fallback;
// the UI shows a translated title for every known kind.
import { calculatePairScore, findMatches } from './matchingEngine'

export const NOTIFICATION_KINDS = Object.freeze({
  PUBLISHED: 'item_published',
  MATCH: 'match_found',
  CLAIM_APPROVED: 'claim_approved',
  CLAIM_REJECTED: 'claim_rejected',
  CLAIM_COMPLETED: 'claim_completed',
})

export const NOTIFICATION_TITLE_KEYS = Object.freeze({
  [NOTIFICATION_KINDS.PUBLISHED]: 'notifPublishedTitle',
  [NOTIFICATION_KINDS.MATCH]: 'notifMatchTitle',
  [NOTIFICATION_KINDS.CLAIM_APPROVED]: 'notifClaimApprovedTitle',
  [NOTIFICATION_KINDS.CLAIM_REJECTED]: 'notifClaimRejectedTitle',
  [NOTIFICATION_KINDS.CLAIM_COMPLETED]: 'notifClaimCompletedTitle',
})

// The demo sends its match email from this score.
export const MATCH_NOTIFY_SCORE = 50
// From this score the side-by-side match alert opens.
export const MATCH_ALERT_SCORE = 60
const MAX_MATCHES_PER_LOST_ITEM = 3
const MAX_OWNERS_PER_FOUND_ITEM = 5

// Only items still waiting for their owner are worth pointing anyone at.
function isOpenForMatching(item) {
  return item.status === 'searching'
}

function matchNotification(lostItem, foundItem, score) {
  return {
    recipientId: lostItem.ownerId,
    kind: NOTIFICATION_KINDS.MATCH,
    itemId: foundItem.id,
    title: 'พบของที่อาจเป็นของคุณ',
    body: `ความใกล้เคียง ${score}% · "${foundItem.titleTh}" ที่ ${foundItem.locationDetailTh} ใกล้เคียงกับรายการแจ้งของหาย "${lostItem.titleTh}"`,
  }
}

/**
 * Notifications to write once staff publish an item: one for its owner, and
 * one per likely match for whoever lost the item in each pair. Finders are
 * not told about matches because the owner is the one who can act (claim).
 * @param {object} approvedItem mapped item that was just published
 * @param {object[]} allItems every item the staff member can see
 * @returns {Array<{ recipientId: string, kind: string, itemId: string, title: string, body: string }>}
 */
export function buildApprovalNotifications(approvedItem, allItems) {
  const published = {
    recipientId: approvedItem.ownerId,
    kind: NOTIFICATION_KINDS.PUBLISHED,
    itemId: approvedItem.id,
    title: 'รายการของคุณเผยแพร่แล้ว',
    body: `"${approvedItem.titleTh}" ผ่านการตรวจสอบและแสดงในระบบแล้ว`,
  }
  const candidates = allItems.filter(item => isOpenForMatching(item) && item.ownerId !== approvedItem.ownerId)
  const matches = findMatches(approvedItem, candidates).filter(match => match.totalScore >= MATCH_NOTIFY_SCORE)

  if (approvedItem.type === 'lost') {
    const forOwner = matches
      .slice(0, MAX_MATCHES_PER_LOST_ITEM)
      .map(match => matchNotification(approvedItem, match.candidate, match.totalScore))
    return [published, ...forOwner]
  }

  // A found item: each owner of a matching lost report hears once, about their
  // best match. findMatches sorts best first, so the first hit per owner wins.
  const bestByOwner = new Map()
  for (const match of matches) {
    if (!bestByOwner.has(match.candidate.ownerId)) bestByOwner.set(match.candidate.ownerId, match)
  }
  const forOwners = [...bestByOwner.values()]
    .slice(0, MAX_OWNERS_PER_FOUND_ITEM)
    .map(match => matchNotification(match.candidate, approvedItem, match.totalScore))
  return [published, ...forOwners]
}

const CLAIM_DECISIONS = {
  approved: { kind: NOTIFICATION_KINDS.CLAIM_APPROVED, title: 'คำขอรับคืนได้รับการอนุมัติ' },
  rejected: { kind: NOTIFICATION_KINDS.CLAIM_REJECTED, title: 'คำขอรับคืนไม่ได้รับการอนุมัติ' },
  completed: { kind: NOTIFICATION_KINDS.CLAIM_COMPLETED, title: 'ส่งมอบคืนเรียบร้อย' },
}

/**
 * The claimant's notification for a staff decision. The staff note goes in
 * too, since claimants already see it under their claims.
 * @param {object} claim mapped claim from listClaimsForStaff
 * @param {'approved' | 'rejected' | 'completed'} decision
 * @param {string} [note]
 */
export function buildClaimDecisionNotification(claim, decision, note) {
  if (!claim?.claimantId || !Object.hasOwn(CLAIM_DECISIONS, decision)) return null
  const { kind, title } = CLAIM_DECISIONS[decision]
  const parts = [`"${claim.itemTitleTh || ''}"`]
  if (decision === 'approved' && claim.handoverPointTh) parts.push(`นัดรับที่ ${claim.handoverPointTh}`)
  if (note) parts.push(`หมายเหตุจากเจ้าหน้าที่: ${note}`)
  return { recipientId: claim.claimantId, kind, itemId: claim.itemId, title, body: parts.join(' · ') }
}

/**
 * Published found items that look like a lost item someone just reported,
 * best first. Found reports get nothing here: owners hear about those when
 * staff publish them.
 */
export function findInstantMatches(reportedItem, allItems) {
  if (reportedItem.type !== 'lost') return []
  const candidates = allItems.filter(item => isOpenForMatching(item) && item.ownerId !== reportedItem.ownerId)
  return findMatches(reportedItem, candidates).filter(match => match.totalScore >= MATCH_NOTIFY_SCORE)
}

/**
 * The user's own open item that best matches `linkedItem`, for reopening the
 * match alert from a notification.
 * @returns {{ source: object, match: object } | null}
 */
export function findBestOwnMatch(linkedItem, myItems) {
  let best = null
  for (const mine of myItems) {
    if (mine.type === linkedItem.type || mine.status === 'returned' || mine.status === 'closed') continue
    const match = calculatePairScore(mine, linkedItem)
    if (!best || match.totalScore > best.match.totalScore) best = { source: mine, match }
  }
  return best
}
