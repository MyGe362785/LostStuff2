// Shared by the staff portal and the claimant's own tracker.
export const CLAIM_STATUS_KEYS = {
  pending: 'claimStatusPending',
  approved: 'claimStatusApproved',
  rejected: 'claimStatusRejected',
  completed: 'claimStatusCompleted',
}

export const CLAIM_STATUS_CLASSES = {
  pending: 'bg-amber-100 text-amber-900 border-amber-300',
  approved: 'bg-purple-100 text-purple-900 border-purple-300',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  completed: 'bg-found-light text-found-dark border-found-border',
}

export function formatDateTime(value, isTh) {
  if (!value) return ''
  return new Date(value).toLocaleString(isTh ? 'th-TH' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' })
}
