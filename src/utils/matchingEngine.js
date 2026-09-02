// Automated Matching Engine for University Lost & Found

/**
 * Calculates match compatibility between a source item and candidate items in the opposite category.
 * (e.g. Lost item vs Found items, or Found item vs Lost items)
 */
export function findMatches(sourceItem, allItems) {
  if (!sourceItem || !allItems || allItems.length === 0) return []

  // Candidate items must have opposite type (lost <-> found) and not be the same item
  const targetType = sourceItem.type === 'lost' ? 'found' : 'lost'
  const candidates = allItems.filter(
    item => item.id !== sourceItem.id && item.type === targetType && item.status !== 'returned'
  )

  const scoredMatches = candidates.map(candidate => {
    let categoryScore = 0
    let locationScore = 0
    let dateScore = 0
    let keywordScore = 0
    const reasonsTh = []
    const reasonsEn = []

    // 1. Category Compatibility (35% Weight)
    if (sourceItem.category === candidate.category) {
      categoryScore = 35
      reasonsTh.push('หมวดหมู่ตรงกัน (Category Match)')
      reasonsEn.push('Identical Category')
    }

    // 2. Location Compatibility (30% Weight)
    if (sourceItem.buildingId && candidate.buildingId) {
      if (sourceItem.buildingId === candidate.buildingId) {
        locationScore = 30
        reasonsTh.push('อาคาร/สถานที่เกิดเหตุตรงกัน (Same Campus Building)')
        reasonsEn.push('Same Campus Building')
      } else {
        // Partial location match if same zone/nearby
        locationScore = 10
      }
    }

    // 3. Date Proximity (20% Weight)
    if (sourceItem.date && candidate.date) {
      const d1 = new Date(sourceItem.date)
      const d2 = new Date(candidate.date)
      const diffDays = Math.abs((d1 - d2) / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        dateScore = 20
        reasonsTh.push('วันที่เกิดเหตุตรงกันพอดี (Same Date)')
        reasonsEn.push('Exact Same Date')
      } else if (diffDays <= 2) {
        dateScore = 16
        reasonsTh.push('วันที่เกิดเหตุใกล้เคียงกัน (ภายใน 1-2 วัน)')
        reasonsEn.push('Within 1-2 days')
      } else if (diffDays <= 5) {
        dateScore = 10
        reasonsTh.push('ช่วงสัปดาห์เดียวกัน')
        reasonsEn.push('Within same week')
      }
    } else {
      dateScore = 10
    }

    // 4. Keyword & Attribute Similarity (15% Weight)
    const extractWords = (str) => {
      if (!str) return []
      return str.toLowerCase()
        .replace(/[^\w\s\u0E00-\u0E7F]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length >= 2)
    }

    const sourceWords = [
      ...extractWords(sourceItem.titleTh),
      ...extractWords(sourceItem.titleEn),
      ...extractWords(sourceItem.descriptionTh),
      ...extractWords(sourceItem.descriptionEn)
    ]

    const candidateWords = [
      ...extractWords(candidate.titleTh),
      ...extractWords(candidate.titleEn),
      ...extractWords(candidate.descriptionTh),
      ...extractWords(candidate.descriptionEn)
    ]

    let commonWordsCount = 0
    const matchedKeywords = new Set()
    for (const word of sourceWords) {
      if (candidateWords.includes(word) && !['the', 'and', 'with', 'สี', 'ที่', 'ใน', 'ของ', 'เป็น'].includes(word)) {
        commonWordsCount++
        matchedKeywords.add(word)
      }
    }

    if (commonWordsCount >= 3) {
      keywordScore = 15
      reasonsTh.push(`พบคีย์เวิร์ดร่วมเด่นชัด: ${Array.from(matchedKeywords).slice(0, 3).join(', ')}`)
      reasonsEn.push(`Matched keywords: ${Array.from(matchedKeywords).slice(0, 3).join(', ')}`)
    } else if (commonWordsCount >= 1) {
      keywordScore = 8
      reasonsTh.push(`พบคีย์เวิร์ดร่วม: ${Array.from(matchedKeywords).slice(0, 2).join(', ')}`)
      reasonsEn.push(`Keywords: ${Array.from(matchedKeywords).slice(0, 2).join(', ')}`)
    }

    const totalScore = Math.min(100, Math.round(categoryScore + locationScore + dateScore + keywordScore))

    return {
      candidate,
      totalScore,
      breakdown: {
        categoryScore,
        locationScore,
        dateScore,
        keywordScore
      },
      reasonsTh,
      reasonsEn,
      isHighConfidence: totalScore >= 60
    }
  })

  // Sort by highest match score first, filter candidates scoring at least 45%
  return scoredMatches
    .filter(m => m.totalScore >= 45)
    .sort((a, b) => b.totalScore - a.totalScore)
}
