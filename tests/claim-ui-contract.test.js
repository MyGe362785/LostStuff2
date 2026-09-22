import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('ownership claim UI contract', () => {
  it('keeps all claim calls scoped to found-item posts', () => {
    const itemDetail = readFileSync('src/components/ItemDetailModal.vue', 'utf8')
    const quickFound = readFileSync('src/components/QuickFoundModal.vue', 'utf8')
    const matchAlert = readFileSync('src/components/MatchAlertModal.vue', 'utf8')
    const app = readFileSync('src/App.vue', 'utf8')

    expect(itemDetail).toContain("item.type === 'found' && item.status !== 'returned' && item.status !== 'closed'")
    expect(quickFound).toContain('v-if="item.type === \'found\'"')
    expect(matchAlert).toContain('v-if="candidateItem.type === \'found\'"')
    expect(app).toContain("if (item.type !== 'found')")
  })

  it('provides an accessible private-evidence upload and optional lost-post selector', () => {
    const modal = readFileSync('src/components/ClaimModal.vue', 'utf8')

    expect(modal).toContain('type="file"')
    expect(modal).toContain('accept="image/jpeg,image/png,image/webp')
    expect(modal).toContain('@drop.prevent="handleDrop"')
    expect(modal).toContain('URL.createObjectURL(file)')
    expect(modal).toContain('removeClaimEvidence')
    expect(modal).toContain('id="linked-lost-post"')
    expect(modal).toContain('linkedLostItemId: linkedLostPostId.value || null')
  })
})
