// 5-Factor Automated Matching Engine for University Lost & Found
// Implements Proposal Section 4 (Page 3):
// "การจับคู่รายการจะเริ่มจากการจัดรูปแบบข้อมูลให้เป็นมาตรฐาน เช่น ประเภทของสิ่งของ สี และคำสำคัญ
// จากนั้นระบบจะคำนวณคะแนนความใกล้เคียง โดยพิจารณาจากปัจจัยต่าง ๆ ได้แก่
// 1. ประเภทสิ่งของ (30%)
// 2. สี (20%)
// 3. สถานที่ (20%)
// 4. ช่วงเวลาที่แจ้ง (15%)
// 5. คำอธิบาย ยี่ห้อ และจุดสังเกต (15%)"

/**
 * Normalizes Thai & English color text for robust color matching
 */
const colorDictionary = {
  black: ['ดำ', 'สีดำ', 'black', 'dark', 'matte black', 'ดำด้าน'],
  white: ['ขาว', 'สีขาว', 'white', 'ivory', 'cream'],
  gray: ['เทา', 'สีเทา', 'gray', 'grey', 'space gray', 'สเปซเกรย์', 'เงิน', 'สีเงิน', 'silver', 'chrome'],
  navy: ['น้ำเงิน', 'กรม', 'navy', 'navy blue', 'สีน้ำเงิน', 'สีน้ำเงินเข้ม', 'dark blue'],
  lightblue: ['ฟ้า', 'สีฟ้า', 'lightblue', 'light blue', 'sky blue', 'blue'],
  brown: ['น้ำตาล', 'สีน้ำตาล', 'brown', 'tan', 'dark brown'],
  pink: ['ชมพู', 'สีชมพู', 'pink', 'pastel pink', 'rose gold'],
  red: ['แดง', 'สีแดง', 'red', 'crimson'],
  orange: ['ส้ม', 'สีส้ม', 'orange', 'แสด'],
  green: ['เขียว', 'สีเขียว', 'green', 'olive'],
  yellow: ['เหลือง', 'สีเหลือง', 'yellow', 'gold'],
  purple: ['ม่วง', 'สีม่วง', 'purple', 'violet', 'lavender']
}

function resolveColorFamily(colorStr) {
  if (!colorStr) return null
  const cleaned = colorStr.toLowerCase().trim()
  for (const [family, aliases] of Object.entries(colorDictionary)) {
    if (aliases.some(alias => cleaned.includes(alias))) {
      return family
    }
  }
  return cleaned
}

/**
 * Extracts normalized tokens/keywords from Thai and English text strings
 */
function extractKeywords(str) {
  if (!str) return []
  const stopWords = ['the', 'and', 'with', 'for', 'from', 'in', 'on', 'at', 'สี', 'ที่', 'ใน', 'ของ', 'เป็น', 'และ', 'หรือ', 'มี', 'พบ', 'ลืม', 'ทำ', 'ได้']
  return str.toLowerCase()
    .replace(/[^\w\s\u0E00-\u0E7F]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 2 && !stopWords.includes(w))
}

/**
 * Calculates match score between two individual items based on 5 factors
 */
export function calculatePairScore(sourceItem, candidateItem) {
  if (!sourceItem || !candidateItem) {
    return { totalScore: 0, breakdown: {}, reasonsTh: [], reasonsEn: [] }
  }

  let categoryScore = 0
  let colorScore = 0
  let locationScore = 0
  let dateScore = 0
  let textScore = 0

  const reasonsTh = []
  const reasonsEn = []

  // 1. ประเภทสิ่งของ (Category Compatibility) - 30%
  if (sourceItem.category && candidateItem.category) {
    if (sourceItem.category === candidateItem.category) {
      categoryScore = 30
      reasonsTh.push('หมวดหมู่สิ่งของตรงกันอย่างสมบูรณ์ (+30)')
      reasonsEn.push('Identical Category (+30)')
    }
  }

  // 2. สีของสิ่งของ (Color Compatibility) - 20%
  const sourceColorFamily = resolveColorFamily(sourceItem.color || sourceItem.colorNameTh || sourceItem.titleTh)
  const candidateColorFamily = resolveColorFamily(candidateItem.color || candidateItem.colorNameTh || candidateItem.titleTh)

  if (sourceColorFamily && candidateColorFamily) {
    if (sourceColorFamily === candidateColorFamily) {
      colorScore = 20
      reasonsTh.push(`โทนสีตรงกัน (${sourceColorFamily}) (+20)`)
      reasonsEn.push(`Exact Color Match: ${sourceColorFamily} (+20)`)
    } else {
      // Near color tone check (e.g. navy & lightblue, red & orange, red & pink)
      const isToneNear = 
        (sourceColorFamily === 'navy' && candidateColorFamily === 'lightblue') ||
        (sourceColorFamily === 'lightblue' && candidateColorFamily === 'navy') ||
        (sourceColorFamily === 'red' && candidateColorFamily === 'orange') ||
        (sourceColorFamily === 'orange' && candidateColorFamily === 'red') ||
        (sourceColorFamily === 'red' && candidateColorFamily === 'pink') ||
        (sourceColorFamily === 'pink' && candidateColorFamily === 'red')
      if (isToneNear) {
        colorScore = 12
        reasonsTh.push(`โทนสีใกล้เคียงกัน (${sourceColorFamily} ~ ${candidateColorFamily}) (+12)`)
        reasonsEn.push(`Near Color Tone: ${sourceColorFamily} ~ ${candidateColorFamily} (+12)`)
      } else {
        colorScore = 0
      }
    }
  } else if (!sourceItem.color && !candidateItem.color) {
    // If neither specified color explicitly, grant neutral baseline
    colorScore = 5
  }

  // 3. สถานที่เกิดเหตุ (Campus Location Compatibility) - 20%
  if (sourceItem.buildingId && candidateItem.buildingId) {
    if (sourceItem.buildingId === candidateItem.buildingId) {
      locationScore = 20
      reasonsTh.push('อาคารหรือสถานที่เกิดเหตุในมหาวิทยาลัยตรงกัน (+20)')
      reasonsEn.push('Same Campus Building (+20)')
    } else {
      locationScore = 0
    }
  } else {
    locationScore = 5
  }

  // 4. ช่วงเวลาที่แจ้ง (Date & Time Proximity) - 15%
  if (sourceItem.date && candidateItem.date) {
    const d1 = new Date(sourceItem.date)
    const d2 = new Date(candidateItem.date)
    const diffDays = Math.abs((d1 - d2) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      dateScore = 15
      reasonsTh.push('วันที่เกิดเหตุตรงกันพอดี (+15)')
      reasonsEn.push('Exact Same Date (+15)')
    } else if (diffDays <= 2) {
      dateScore = 12
      reasonsTh.push('วันที่เกิดเหตุใกล้เคียงกัน (ภายใน 1-2 วัน) (+12)')
      reasonsEn.push('Within 1-2 days (+12)')
    } else if (diffDays <= 5) {
      dateScore = 6
      reasonsTh.push('ช่วงสัปดาห์เดียวกัน (+6)')
      reasonsEn.push('Within same week (+6)')
    } else {
      dateScore = 0
    }
  } else {
    dateScore = 5
  }

  // 5. คำอธิบาย ยี่ห้อ และจุดสังเกต (Brand, Distinctive Marks & Keyword Overlap) - 15%
  let brandScore = 0
  if (sourceItem.brand && candidateItem.brand) {
    if (sourceItem.brand.toLowerCase() === candidateItem.brand.toLowerCase()) {
      brandScore = 7
      reasonsTh.push(`ยี่ห้อ/แบรนด์ตรงกัน (${sourceItem.brand}) (+7)`)
      reasonsEn.push(`Brand Matched: ${sourceItem.brand} (+7)`)
    }
  }

  const sourceKeywords = new Set([
    ...extractKeywords(sourceItem.titleTh),
    ...extractKeywords(sourceItem.titleEn),
    ...extractKeywords(sourceItem.distinctiveMarks),
    ...extractKeywords(sourceItem.descriptionTh),
    ...extractKeywords(sourceItem.descriptionEn)
  ])

  const candidateKeywords = new Set([
    ...extractKeywords(candidateItem.titleTh),
    ...extractKeywords(candidateItem.titleEn),
    ...extractKeywords(candidateItem.distinctiveMarks),
    ...extractKeywords(candidateItem.descriptionTh),
    ...extractKeywords(candidateItem.descriptionEn)
  ])

  // Remove brand from keywords to avoid double counting
  if (sourceItem.brand) sourceKeywords.delete(sourceItem.brand.toLowerCase())
  if (candidateItem.brand) candidateKeywords.delete(candidateItem.brand.toLowerCase())

  const matchedKeywords = []
  for (const word of sourceKeywords) {
    if (candidateKeywords.has(word)) {
      matchedKeywords.push(word)
    }
  }

  let keywordScore = 0
  if (matchedKeywords.length >= 2) {
    keywordScore = 8
    reasonsTh.push(`พบคีย์เวิร์ดร่วมเด่นชัด: ${matchedKeywords.slice(0, 3).join(', ')} (+8)`)
    reasonsEn.push(`Strong keyword match: ${matchedKeywords.slice(0, 3).join(', ')} (+8)`)
  } else if (matchedKeywords.length === 1) {
    keywordScore = 4
    reasonsTh.push(`พบคีย์เวิร์ดร่วม: ${matchedKeywords[0]} (+4)`)
    reasonsEn.push(`Keywords: ${matchedKeywords[0]} (+4)`)
  }

  textScore = Math.min(15, brandScore + keywordScore)

  const totalScore = Math.min(100, Math.round(categoryScore + colorScore + locationScore + dateScore + textScore))

  return {
    candidate: candidateItem,
    totalScore,
    breakdown: {
      categoryScore,
      colorScore,
      locationScore,
      dateScore,
      textScore
    },
    reasonsTh,
    reasonsEn,
    isHighConfidence: totalScore >= 60
  }
}

/**
 * Calculates match compatibility between a source item and candidate items in the opposite category.
 * (e.g. Lost item vs Found items, or Found item vs Lost items)
 */
export function findMatches(sourceItem, allItems) {
  if (!sourceItem || !allItems || allItems.length === 0) return []

  const targetType = sourceItem.type === 'lost' ? 'found' : 'lost'
  const candidates = allItems.filter(
    item => item.id !== sourceItem.id && item.type === targetType && item.status !== 'returned' && item.status !== 'closed'
  )

  const scoredMatches = candidates.map(candidate => {
    return calculatePairScore(sourceItem, candidate)
  })

  // Filter candidates scoring at least 45%, sort descending by match score
  return scoredMatches
    .filter(m => m.totalScore >= 45)
    .sort((a, b) => b.totalScore - a.totalScore)
}
