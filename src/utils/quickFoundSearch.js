const CLOSED_STATUSES = new Set(['pending_review', 'returned', 'closed'])

function normalize(value) {
  return String(value || '')
    .normalize('NFKC')
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

function getCreatedTime(item) {
  const timestamp = new Date(item.createdAt || item.date || 0).getTime()
  return Number.isNaN(timestamp) ? 0 : timestamp
}

function scoreItemName(item, normalizedQuery, terms) {
  const title = normalize([item.titleTh, item.titleEn].join(' '))
  const matchedTerms = terms.filter(term => title.includes(term)).length
  let score = matchedTerms

  if (title === normalizedQuery) score += 100
  else if (title.startsWith(normalizedQuery)) score += 60
  else if (title.includes(normalizedQuery)) score += 40

  return { score, matchedTerms }
}

/**
 * Returns active found-item reports whose Thai or English item name matches the typed name.
 */
export function getQuickFoundMatches(query, allItems) {
  const normalizedQuery = normalize(query)
  if (!normalizedQuery) return []

  const parsedTerms = [...new Set(normalizedQuery.split(' ').filter(term => term.length >= 2))]
  const terms = parsedTerms.length ? parsedTerms : [normalizedQuery]

  return (allItems || [])
    .filter(item => item.type === 'found' && !CLOSED_STATUSES.has(item.status))
    .map(item => {
      const match = scoreItemName(item, normalizedQuery, terms)
      return { item, ...match }
    })
    .filter(result => result.matchedTerms === terms.length)
    .sort((a, b) => b.score - a.score || getCreatedTime(b.item) - getCreatedTime(a.item))
    .map(result => result.item)
}
