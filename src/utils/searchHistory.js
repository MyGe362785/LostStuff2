export const MAX_SEARCH_HISTORY = 8

export function normalizeSearchTerm(value) {
  if (typeof value !== 'string') return ''
  return value.trim().replace(/\s+/g, ' ').slice(0, 120)
}

export function parseSearchHistory(value) {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return []
    const history = []
    for (const entry of parsed) {
      const term = normalizeSearchTerm(entry)
      if (!term || history.some(saved => saved.toLocaleLowerCase() === term.toLocaleLowerCase())) continue
      history.push(term)
      if (history.length === MAX_SEARCH_HISTORY) break
    }
    return history
  } catch {
    return []
  }
}

export function addSearchHistoryTerm(history, value, limit = MAX_SEARCH_HISTORY) {
  const term = normalizeSearchTerm(value)
  if (!term) return Array.isArray(history) ? history.slice(0, limit) : []
  const current = Array.isArray(history) ? history : []
  const deduplicated = current.filter(entry => normalizeSearchTerm(entry).toLocaleLowerCase() !== term.toLocaleLowerCase())
  return [term, ...deduplicated].slice(0, limit)
}

export function removeSearchHistoryTerm(history, value) {
  const target = normalizeSearchTerm(value).toLocaleLowerCase()
  if (!target || !Array.isArray(history)) return Array.isArray(history) ? history : []
  return history.filter(entry => normalizeSearchTerm(entry).toLocaleLowerCase() !== target)
}
