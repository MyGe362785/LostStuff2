import { describe, expect, it } from 'vitest'
import { handoverLocations } from '../src/data/campusLocations'

describe('official campus handover locations', () => {
  it('offers all four official drop-off points', () => {
    expect(handoverLocations).toHaveLength(4)
    expect(handoverLocations.map(location => location.id)).toEqual([
      'dorm_nine_cafeteria',
      'kku_library_office',
      'sc09_wittayawiphas',
      'kku_security_division',
    ])
  })

  it('uses the requested details for the two new service points', () => {
    expect(handoverLocations.find(location => location.id === 'sc09_wittayawiphas')).toMatchObject({
      handoverPointTh: 'จุดฝากของชั้น 1',
      operatingHoursTh: '08.00 – 18.00 น.',
    })

    expect(handoverLocations.find(location => location.id === 'kku_security_division')).toMatchObject({
      handoverPointTh: 'กองป้องกันและรักษาความปลอดภัย',
      operatingHoursTh: '08.00 – 18.00 น.',
    })
  })

  it('provides map coordinates and Google Maps links for every service point', () => {
    for (const location of handoverLocations) {
      expect(location.latitude).toBeTypeOf('number')
      expect(location.longitude).toBeTypeOf('number')
      expect(location.mapUrl).toMatch(/^https:\/\/maps\.app\.goo\.gl\//)
    }
  })
})
