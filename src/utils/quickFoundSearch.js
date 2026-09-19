import { itemCategories } from '../data/campusLocations.js'

const CLOSED_STATUSES = new Set(['pending_review', 'returned', 'closed'])

function normalize(value) {
  return String(value || '')
    .normalize('NFKC')
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

function getCategorySearchText(categoryId) {
  const category = itemCategories.find(item => item.id === categoryId)
  if (!category) return categoryId || ''
  return [category.id, category.nameTh, category.nameEn].join(' ')
}

function getSearchFields(item) {
  return [
    { value: [item.titleTh, item.titleEn].join(' '), weight: 9 },
    { value: [item.color, item.colorNameTh, item.colorNameEn].join(' '), weight: 6 },
    { value: item.brand, weight: 6 },
    { value: getCategorySearchText(item.category), weight: 5 },
    { value: item.distinctiveMarks, weight: 5 },
    { value: [item.descriptionTh, item.descriptionEn].join(' '), weight: 3 },
    { value: [item.locationDetailTh, item.locationDetailEn].join(' '), weight: 2 },
  ].map(field => ({ ...field, value: normalize(field.value) }))
}

function getCreatedTime(item) {
  const timestamp = new Date(item.createdAt || item.date || 0).getTime()
  return Number.isNaN(timestamp) ? 0 : timestamp
}

function scoreItem(item, normalizedQuery, terms) {
  const fields = getSearchFields(item)
  let score = 0
  let matchedTerms = 0

  fields.forEach(field => {
    if (normalizedQuery && field.value.includes(normalizedQuery)) score += field.weight * 3
  })

  terms.forEach(term => {
    const bestField = fields.reduce((best, field) => field.value.includes(term) ? Math.max(best, field.weight) : best, 0)
    if (bestField > 0) {
      matchedTerms += 1
      score += bestField
    }
  })

  if (matchedTerms === terms.length && terms.length > 1) score += 12
  return { score, matchedTerms }
}

/**
 * Returns active, approved found-item reports ranked against the visitor's free-text query.
 * An empty query intentionally returns all available found items, newest first.
 */
export function getQuickFoundMatches(query, allItems) {
  const normalizedQuery = normalize(query)
  const parsedTerms = [...new Set(normalizedQuery.split(' ').filter(term => term.length >= 2))]
  const terms = parsedTerms.length ? parsedTerms : (normalizedQuery ? [normalizedQuery] : [])
  const minimumMatchedTerms = Math.max(1, Math.ceil(terms.length * 0.6))

  return (allItems || [])
    .filter(item => item.type === 'found' && !CLOSED_STATUSES.has(item.status))
    .map(item => {
      const match = normalizedQuery ? scoreItem(item, normalizedQuery, terms) : { score: 0, matchedTerms: 0 }
      return { item, ...match }
    })
    .filter(result => !normalizedQuery || result.matchedTerms >= minimumMatchedTerms)
    .sort((a, b) => b.score - a.score || getCreatedTime(b.item) - getCreatedTime(a.item))
    .map(result => result.item)
}
