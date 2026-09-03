// Benchmark dataset for testing Matching Engine Accuracy
// Required by Proposal Section 7.2 (Page 5): การทดสอบประสิทธิภาพของระบบจับคู่ โดยใช้ข้อมูลตัวอย่าง

export const benchmarkPairs = [
  {
    id: 'tc-01',
    caseTitleTh: 'เคสที่ 1: หูฟัง AirPods Pro 2 สีดำ (คู่ตรงสมบูรณ์)',
    caseTitleEn: 'Test Case 1: AirPods Pro 2 Black (Exact Match)',
    expectedMatch: true,
    expectedReasonTh: 'หมวดหมู่อิเล็กทรอนิกส์ตรงกัน, สีดำตรงกัน, อาคาร SC ห้อง SC-205 ตรงกัน, วันที่เดียวกัน, ยี่ห้อ Apple และคำค้น K.N. ตรงกัน',
    lostItem: {
      id: 'bench-lost-01',
      type: 'lost',
      category: 'electronics',
      titleTh: 'หูฟัง AirPods Pro 2 เคสซิลิโคนสีดำ สลักชื่อ K.N.',
      titleEn: 'AirPods Pro 2 in black silicone case with K.N. engraving',
      color: 'black',
      brand: 'Apple',
      buildingId: 'bld_sc',
      date: '2026-09-01',
      descriptionTh: 'ลืมไว้ที่ห้อง SC-205 เคสสีดำ สลักชื่อ K.N.',
      descriptionEn: 'Forgotten at SC-205 black case engraved K.N.'
    },
    foundItem: {
      id: 'bench-found-01',
      type: 'found',
      category: 'electronics',
      titleTh: 'พบหูฟังเคสสีดำ AirPods Pro 2 พร้อมตะขอเงิน',
      titleEn: 'Found AirPods Pro 2 black case with silver carabiner',
      color: 'black',
      brand: 'Apple',
      buildingId: 'bld_sc',
      date: '2026-09-01',
      descriptionTh: 'พบที่โต๊ะแถวหน้าห้อง SC-205 อาคารเรียนรวม SC เคสสีดำ',
      descriptionEn: 'Found at SC-205 lecture hall SC complex black case'
    }
  },
  {
    id: 'tc-02',
    caseTitleTh: 'เคสที่ 2: ร่มพับ MUJI สีน้ำเงินเข้ม ด้ามไม้ (คู่ตรงต่างวันเล็กน้อย)',
    caseTitleEn: 'Test Case 2: MUJI Navy Umbrella (Proximity Match)',
    expectedMatch: true,
    expectedReasonTh: 'หมวดหมู่ของใช้ส่วนตัวตรงกัน, สีน้ำเงิน Navy ตรงกัน, สำนักหอสมุดกลางตรงกัน, วันที่ห่างกัน 1 วัน, ยี่ห้อ MUJI ตรงกัน',
    lostItem: {
      id: 'bench-lost-02',
      type: 'lost',
      category: 'personal_items',
      titleTh: 'ร่มพับ MUJI สีน้ำเงิน ด้ามไม้แท้',
      titleEn: 'MUJI folding umbrella navy blue wood handle',
      color: 'navy',
      brand: 'MUJI',
      buildingId: 'bld_library',
      date: '2026-08-30',
      descriptionTh: 'ลืมไว้ที่ชั้นวางร่มหน้าหอสมุดกลาง ร่มสีน้ำเงินเข้ม ด้ามไม้',
      descriptionEn: 'Forgotten at umbrella stand Central Library navy wood handle'
    },
    foundItem: {
      id: 'bench-found-02',
      type: 'found',
      category: 'personal_items',
      titleTh: 'พบร่มพับอัตโนมัติ สีน้ำเงินเข้ม ด้ามไม้ MUJI',
      titleEn: 'Found MUJI automatic navy folding umbrella wood handle',
      color: 'navy',
      brand: 'MUJI',
      buildingId: 'bld_library',
      date: '2026-08-31',
      descriptionTh: 'พบที่วางร่มหน้าประตูทางเข้าหอสมุด ชั้น 1',
      descriptionEn: 'Found at umbrella rack entrance Central Library 1st floor'
    }
  },
  {
    id: 'tc-03',
    caseTitleTh: 'เคสที่ 3: ปากกา Apple Pencil สีชมพู (คู่ตรงอาคารเดียวกัน)',
    caseTitleEn: 'Test Case 3: Apple Pencil Pink Sleeve (Same Building)',
    expectedMatch: true,
    expectedReasonTh: 'หมวดเครื่องเขียนตรงกัน, สีชมพูตรงกัน, อาคาร SC ชั้น 2 ตรงกัน, วันที่ตรงกัน, ยี่ห้อ Apple ตรงกัน',
    lostItem: {
      id: 'bench-lost-03',
      type: 'lost',
      category: 'stationery_books',
      titleTh: 'ปากกา Apple Pencil รุ่น 2 ปลอกสีชมพู',
      titleEn: 'Apple Pencil Gen 2 pink silicone sleeve',
      color: 'pink',
      brand: 'Apple',
      buildingId: 'bld_sc',
      date: '2026-09-02',
      descriptionTh: 'ทำตกตอนเดินระหว่างห้องเรียน SC ชั้น 2 ปลอกสีชมพูพาสเทล',
      descriptionEn: 'Dropped while walking SC 2nd floor pastel pink'
    },
    foundItem: {
      id: 'bench-found-03',
      type: 'found',
      category: 'stationery_books',
      titleTh: 'เก็บปากกา Apple Pencil 2 ปลอกซิลิโคนสีชมพูได้',
      titleEn: 'Found Apple Pencil 2 in pink silicone sleeve',
      color: 'pink',
      brand: 'Apple',
      buildingId: 'bld_sc',
      date: '2026-09-02',
      descriptionTh: 'ตกอยู่ที่พื้นทางเดินหน้าห้อง SC2-201 ชั้น 2',
      descriptionEn: 'Found on floor outside room SC2-201 2nd floor'
    }
  },
  {
    id: 'tc-04',
    caseTitleTh: 'เคสที่ 4: กระเป๋าเงิน Coach สีน้ำตาล (คู่ตรงโรงอาหารกลาง)',
    caseTitleEn: 'Test Case 4: Coach Brown Wallet (Central Canteen)',
    expectedMatch: true,
    expectedReasonTh: 'หมวดกระเป๋า/บัตรตรงกัน, สีน้ำตาลตรงกัน, โรงอาหาร C1 ตรงกัน, วันที่ตรงกัน, แบรนด์ Coach',
    lostItem: {
      id: 'bench-lost-04',
      type: 'lost',
      category: 'cards_wallets',
      titleTh: 'กระเป๋าใส่บัตร Coach สีน้ำตาล มีบัตรนักศึกษา',
      titleEn: 'Coach brown cardholder with student ID',
      color: 'brown',
      brand: 'Coach',
      buildingId: 'bld_canteen',
      date: '2026-09-02',
      descriptionTh: 'ลืมไว้ที่โรงอาหาร C1 ช่วงพักกลางวัน สีน้ำตาลเข้ม',
      descriptionEn: 'Forgotten at C1 cafeteria during lunch dark brown'
    },
    foundItem: {
      id: 'bench-found-04',
      type: 'found',
      category: 'cards_wallets',
      titleTh: 'พบบัตรนักศึกษาและกระเป๋าใส่บัตรหนังสีน้ำตาล',
      titleEn: 'Found student ID and brown leather cardholder',
      color: 'brown',
      brand: 'Coach',
      buildingId: 'bld_canteen',
      date: '2026-09-02',
      descriptionTh: 'พบที่โต๊ะอาหารหน้าร้านข้าวมันไก่ โรงอาหารกลาง C1',
      descriptionEn: 'Found on table at central cafeteria C1 chicken rice stall'
    }
  },
  {
    id: 'tc-05',
    caseTitleTh: 'เคสที่ 5: พวงกุญแจหอพัก Totoro สีเทา (คู่ตรงศูนย์กีฬา)',
    caseTitleEn: 'Test Case 5: Totoro Keychain Gray (Sports Complex)',
    expectedMatch: true,
    expectedReasonTh: 'หมวดกุญแจตรงกัน, สีเทาตรงกัน, อาคารศูนย์กีฬาตรงกัน, วันที่ตรงกัน, คีย์เวิร์ด Totoro ตรงกัน',
    lostItem: {
      id: 'bench-lost-05',
      type: 'lost',
      category: 'keys_vehicles',
      titleTh: 'พวงกุญแจหอพัก 3 ดอก ตุ๊กตา Totoro สีเทา',
      titleEn: 'Dorm keychain 3 keys with gray Totoro',
      color: 'gray',
      brand: 'Studio Ghibli',
      buildingId: 'bld_sports',
      date: '2026-09-01',
      descriptionTh: 'ลืมไว้ที่ม้านั่งข้างสนามบาสเกตบอล ศูนย์กีฬา มีตุ๊กตาโทโทโร่สีเทา',
      descriptionEn: 'Forgotten at bench near basketball court sports complex with Totoro'
    },
    foundItem: {
      id: 'bench-found-05',
      type: 'found',
      category: 'keys_vehicles',
      titleTh: 'พบกุญแจห้องและตุ๊กตา Totoro สีเทา',
      titleEn: 'Found dorm keys and gray Totoro plush',
      color: 'gray',
      brand: 'Studio Ghibli',
      buildingId: 'bld_sports',
      date: '2026-09-01',
      descriptionTh: 'พบที่ข้างสนามบาสเกตบอลในร่ม ศูนย์กีฬามหาวิทยาลัย',
      descriptionEn: 'Found beside indoor basketball court university sports complex'
    }
  },
  {
    id: 'tc-06',
    caseTitleTh: 'เคสที่ 6: iPad Air สีเทา vs หูฟังเคสสีดำ (คนละหมวดและสี - ต้องไม่จับคู่)',
    caseTitleEn: 'Test Case 6: iPad Gray vs AirPods Black (True Negative)',
    expectedMatch: false,
    expectedReasonTh: 'คนละชนิดสิ่งของ, สีคนละสี (เทา vs ดำ), คนละอาคาร (หอสมุด vs อาคาร SC)',
    lostItem: {
      id: 'bench-lost-06',
      type: 'lost',
      category: 'electronics',
      titleTh: 'iPad Air 5 สีเทาสเปซเกรย์',
      titleEn: 'iPad Air 5 Space Gray',
      color: 'gray',
      brand: 'Apple',
      buildingId: 'bld_library',
      date: '2026-09-01',
      descriptionTh: 'ลืมไว้ที่หอสมุดกลาง ชั้น 3 โต๊ะอ่านหนังสือ',
      descriptionEn: 'Forgotten at Central Library 3rd floor study desk'
    },
    foundItem: {
      id: 'bench-found-06',
      type: 'found',
      category: 'electronics',
      titleTh: 'พบหูฟัง AirPods Pro เคสสีดำ',
      titleEn: 'Found AirPods Pro in black case',
      color: 'black',
      brand: 'Apple',
      buildingId: 'bld_sc',
      date: '2026-09-01',
      descriptionTh: 'พบที่โต๊ะเลคเชอร์ SC-205 อาคารเรียนรวม SC',
      descriptionEn: 'Found at lecture desk SC-205 SC complex'
    }
  },
  {
    id: 'tc-07',
    caseTitleTh: 'เคสที่ 7: บัตรนักศึกษา Coach น้ำตาล vs กุญแจหอพัก (คนละหมวด - ต้องไม่จับคู่)',
    caseTitleEn: 'Test Case 7: Wallet vs Keychain (True Negative)',
    expectedMatch: false,
    expectedReasonTh: 'หมวดหมู่ต่างกันชัดเจน (cards_wallets vs keys_vehicles), สีต่างกัน, สถานที่ต่างกัน',
    lostItem: {
      id: 'bench-lost-07',
      type: 'lost',
      category: 'cards_wallets',
      titleTh: 'กระเป๋าบัตรหนังสีน้ำตาล Coach',
      titleEn: 'Coach brown cardholder',
      color: 'brown',
      brand: 'Coach',
      buildingId: 'bld_canteen',
      date: '2026-09-02',
      descriptionTh: 'ลืมไว้ที่โรงอาหารกลาง C1',
      descriptionEn: 'Forgotten at central canteen C1'
    },
    foundItem: {
      id: 'bench-found-07',
      type: 'found',
      category: 'keys_vehicles',
      titleTh: 'พบพวงกุญแจ Totoro สีเทา',
      titleEn: 'Found Totoro keychain gray',
      color: 'gray',
      brand: 'Studio Ghibli',
      buildingId: 'bld_sports',
      date: '2026-09-01',
      descriptionTh: 'พบที่ศูนย์กีฬา มหาวิทยาลัย',
      descriptionEn: 'Found at sports complex'
    }
  },
  {
    id: 'tc-08',
    caseTitleTh: 'เคสที่ 8: เป้สะพายหลัง The North Face สีดำ vs ร่ม MUJI สีน้ำเงิน (คนละหมวด - ต้องไม่จับคู่)',
    caseTitleEn: 'Test Case 8: Backpack Black vs Umbrella Navy (True Negative)',
    expectedMatch: false,
    expectedReasonTh: 'คนละหมวดหมู่, คนละสี (ดำ vs น้ำเงิน), คนละอาคาร (คณะวิศวะ vs หอสมุด)',
    lostItem: {
      id: 'bench-lost-08',
      type: 'lost',
      category: 'others',
      titleTh: 'กระเป๋าเป้ The North Face สีดำ',
      titleEn: 'The North Face black backpack',
      color: 'black',
      brand: 'The North Face',
      buildingId: 'bld_eng',
      date: '2026-09-02',
      descriptionTh: 'ลืมไว้ที่ลานเกียร์ คณะวิศวกรรมศาสตร์',
      descriptionEn: 'Forgotten at gear courtyard engineering'
    },
    foundItem: {
      id: 'bench-found-08',
      type: 'found',
      category: 'personal_items',
      titleTh: 'พบร่มพับ MUJI สีน้ำเงิน',
      titleEn: 'Found MUJI navy umbrella',
      color: 'navy',
      brand: 'MUJI',
      buildingId: 'bld_library',
      date: '2026-08-31',
      descriptionTh: 'พบที่วางร่มหน้าหอสมุดกลาง',
      descriptionEn: 'Found at umbrella stand Central Library'
    }
  },
  {
    id: 'tc-09',
    caseTitleTh: 'เคสที่ 9: กระติกน้ำ Stanley ขาว vs ปากกา Apple Pencil ชมพู (คนละหมวด - ต้องไม่จับคู่)',
    caseTitleEn: 'Test Case 9: Stanley Tumbler White vs Apple Pencil Pink (True Negative)',
    expectedMatch: false,
    expectedReasonTh: 'คนละหมวดหมู่ (ของใช้ vs เครื่องเขียน), สีขาว vs ชมพู, คนละสถานที่',
    lostItem: {
      id: 'bench-lost-09',
      type: 'lost',
      category: 'personal_items',
      titleTh: 'กระติกน้ำ Stanley สีขาว มีสติกเกอร์ Snoopy',
      titleEn: 'Stanley white tumbler with Snoopy',
      color: 'white',
      brand: 'Stanley',
      buildingId: 'bld_library',
      date: '2026-08-28',
      descriptionTh: 'ลืมไว้ที่หอสมุดกลาง',
      descriptionEn: 'Forgotten at Central Library'
    },
    foundItem: {
      id: 'bench-found-09',
      type: 'found',
      category: 'stationery_books',
      titleTh: 'พบ Apple Pencil ปลอกสีชมพู',
      titleEn: 'Found Apple Pencil with pink sleeve',
      color: 'pink',
      brand: 'Apple',
      buildingId: 'bld_sc',
      date: '2026-09-02',
      descriptionTh: 'พบที่อาคารเรียนรวม SC',
      descriptionEn: 'Found at SC building'
    }
  },
  {
    id: 'tc-10',
    caseTitleTh: 'เคสที่ 10: หมวกแก๊ปสีดำ vs เคสกุญแจสีน้ำตาล (คนละสิ่งของ - ต้องไม่จับคู่)',
    caseTitleEn: 'Test Case 10: Black Cap vs Brown Keycase (True Negative)',
    expectedMatch: false,
    expectedReasonTh: 'หมวดหมู่ต่างกัน, สีดำ vs สีน้ำตาล, คนละสถานที่และช่วงเวลา',
    lostItem: {
      id: 'bench-lost-10',
      type: 'lost',
      category: 'personal_items',
      titleTh: 'หมวกแก๊ปสีดำ ยี่ห้อ Nike',
      titleEn: 'Nike black cap',
      color: 'black',
      brand: 'Nike',
      buildingId: 'bld_sports',
      date: '2026-08-25',
      descriptionTh: 'ลืมไว้ที่อัฒจันทร์สนามฟุตบอล',
      descriptionEn: 'Forgotten at football stadium stand'
    },
    foundItem: {
      id: 'bench-found-10',
      type: 'found',
      category: 'keys_vehicles',
      titleTh: 'พวงกุญแจในซองหนังสีน้ำตาล',
      titleEn: 'Keys in brown leather pouch',
      color: 'brown',
      brand: 'Unknown',
      buildingId: 'bld_canteen',
      date: '2026-09-02',
      descriptionTh: 'พบที่โต๊ะโรงอาหาร C1',
      descriptionEn: 'Found at canteen table C1'
    }
  }
]

/**
 * Runs the matching benchmark against the 10 test cases.
 * Returns Precision, Recall, F1, Accuracy, and detailed individual breakdown.
 */
export function runMatchingBenchmark(scoringFunction, threshold = 60) {
  let truePositives = 0
  let falsePositives = 0
  let trueNegatives = 0
  let falseNegatives = 0
  const detailedResults = []
  let totalPositiveScore = 0
  let positiveScoreCount = 0

  for (const pair of benchmarkPairs) {
    const scoreResult = scoringFunction(pair.lostItem, pair.foundItem)
    const predictedMatch = scoreResult.totalScore >= threshold

    let outcome = ''
    if (pair.expectedMatch && predictedMatch) {
      truePositives++
      outcome = 'TP' // True Positive (Match ถูกต้อง)
      totalPositiveScore += scoreResult.totalScore
      positiveScoreCount++
    } else if (!pair.expectedMatch && !predictedMatch) {
      trueNegatives++
      outcome = 'TN' // True Negative (ปฏิเสธถูกต้อง)
    } else if (!pair.expectedMatch && predictedMatch) {
      falsePositives++
      outcome = 'FP' // False Positive (ผิด: ไม่ควรจับคู่ แต่จับคู่)
    } else if (pair.expectedMatch && !predictedMatch) {
      falseNegatives++
      outcome = 'FN' // False Negative (ผิด: ควรจับคู่ แต่พลาด)
    }

    detailedResults.push({
      id: pair.id,
      caseTitleTh: pair.caseTitleTh,
      caseTitleEn: pair.caseTitleEn,
      expectedMatch: pair.expectedMatch,
      predictedMatch,
      outcome,
      isCorrect: (pair.expectedMatch === predictedMatch),
      score: scoreResult.totalScore,
      breakdown: scoreResult.breakdown,
      reasonsTh: scoreResult.reasonsTh,
      expectedReasonTh: pair.expectedReasonTh
    })
  }

  const total = benchmarkPairs.length
  const accuracy = Math.round(((truePositives + trueNegatives) / total) * 100)
  const precision = (truePositives + falsePositives) > 0 
    ? Math.round((truePositives / (truePositives + falsePositives)) * 100) 
    : 100
  const recall = (truePositives + falseNegatives) > 0 
    ? Math.round((truePositives / (truePositives + falseNegatives)) * 100) 
    : 100
  const f1 = (precision + recall) > 0 
    ? Math.round((2 * precision * recall) / (precision + recall)) 
    : 100
  const avgMatchedScore = positiveScoreCount > 0 
    ? Math.round(totalPositiveScore / positiveScoreCount) 
    : 0

  return {
    total,
    truePositives,
    falsePositives,
    trueNegatives,
    falseNegatives,
    accuracy,
    precision,
    recall,
    f1,
    avgMatchedScore,
    detailedResults
  }
}
