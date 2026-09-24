import { describe, expect, it } from 'vitest'
import {
  MAX_SEARCH_HISTORY,
  addSearchHistoryTerm,
  normalizeSearchTerm,
  parseSearchHistory,
  removeSearchHistoryTerm,
} from '../src/utils/searchHistory.js'

describe('search history', () => {
  it('normalizes whitespace and ignores blank searches', () => {
    expect(normalizeSearchTerm('  กระเป๋า   สีดำ  ')).toBe('กระเป๋า สีดำ')
    expect(addSearchHistoryTerm(['iPad'], '   ')).toEqual(['iPad'])
  })

  it('moves repeated terms to the front without case-sensitive duplicates', () => {
    expect(addSearchHistoryTerm(['Wallet', 'AirPods'], ' wallet ')).toEqual(['wallet', 'AirPods'])
  })

  it('keeps only the most recent terms', () => {
    const history = Array.from({ length: MAX_SEARCH_HISTORY }, (_, index) => `term-${index}`)
    const updated = addSearchHistoryTerm(history, 'newest')
    expect(updated).toHaveLength(MAX_SEARCH_HISTORY)
    expect(updated[0]).toBe('newest')
    expect(updated).not.toContain(`term-${MAX_SEARCH_HISTORY - 1}`)
  })

  it('parses stored history defensively and supports removing one term', () => {
    expect(parseSearchHistory('{broken')).toEqual([])
    expect(parseSearchHistory(JSON.stringify(['iPad', 42, 'AirPods']))).toEqual(['iPad', 'AirPods'])
    expect(removeSearchHistoryTerm(['iPad', 'AirPods'], 'IPAD')).toEqual(['AirPods'])
  })
})
