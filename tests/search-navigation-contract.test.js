import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const app = readFileSync('src/App.vue', 'utf8')
const hero = readFileSync('src/components/HeroBanner.vue', 'utf8')

describe('public search and navigation contract', () => {
  it('restores public tabs from browser history and replaces secondary routes on exit', () => {
    expect(app).toContain("const PUBLIC_TABS = new Set(['home', 'search', 'my-posts', 'locations'])")
    expect(app).toContain("activeTab.value = PUBLIC_TABS.has(historyTab) ? historyTab : 'home'")
    expect(app).toContain("window.history.replaceState(state, '', '/')")
    expect(app).toContain("window.history.replaceState({ founditTab: 'home' }, '', '/')")
    expect(app).toContain("if (window.history.state?.founditTab !== 'home')")
  })

  it('records submitted searches instead of every input change', () => {
    expect(app).toContain('@trigger-search="submitSearch"')
    expect(app).toContain('rememberSearchTerm(searchQuery.value)')
    expect(hero).toContain("@input=\"$emit('update:searchQuery', $event.target.value)\"")
    expect(hero).not.toContain("@input=\"$emit('select-history'")
  })

  it('shows both the active term and reusable search history on the results page', () => {
    expect(app).toContain("t('searchingFor')")
    expect(app).toContain('“{{ activeSearchTerm }}”')
    expect(app).toContain('<SearchHistory')
  })
})
