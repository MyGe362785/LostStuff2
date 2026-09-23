import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const popupFiles = [
  'src/components/AdminPortal.vue',
  'src/components/AuthModal.vue',
  'src/components/ClaimModal.vue',
  'src/components/EmailInboxModal.vue',
  'src/components/EvaluationModal.vue',
  'src/components/ItemDetailModal.vue',
  'src/components/MatchAlertModal.vue',
  'src/components/NotificationsModal.vue',
  'src/components/QuickFoundModal.vue',
  'src/components/ReportModal.vue',
  'src/components/StaffDashboardModal.vue',
]

describe('popup dismissal contract', () => {
  it('does not attach click handlers to modal backdrops or full-screen popup layers', () => {
    for (const file of popupFiles) {
      const source = readFileSync(file, 'utf8')
      const clickableFullScreenLayer = /<[^>]+(?=[^>]*(?:fixed|absolute) inset-0)(?=[^>]*@click(?:\.self)?=)[^>]*>/s
      expect(source, file).not.toMatch(clickableFullScreenLayer)
    }
  })

  it('does not dismiss popups with Escape', () => {
    const app = readFileSync('src/App.vue', 'utf8')
    const quickFound = readFileSync('src/components/QuickFoundModal.vue', 'utf8')
    const tour = readFileSync('src/components/FirstVisitTour.vue', 'utf8')

    expect(app).not.toContain("e.key === 'Escape'")
    expect(quickFound).not.toContain("event.key === 'Escape'")
    expect(tour).not.toContain("event.key === 'Escape'")
  })
})
