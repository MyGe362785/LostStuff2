// Internationalization (i18n) dictionary for Thai & English

export const translations = {
  th: {
    appTitle: 'LostStuff2',
    appSubtitle: 'ระบบแจ้งเตือนและติดตามของหายในมหาวิทยาลัย',
    navHome: 'หน้าหลัก',
    navSearch: 'คลังค้นหา & รายการ',
    navReportLost: 'แจ้งทำของหาย',
    navReportFound: 'แจ้งเก็บของได้',
    navMyReports: 'รายการของฉัน',
    navLocations: 'จุดรับ-ส่งของ',
    navFaq: 'วิธีใช้งาน & ความปลอดภัย',
    navResetData: 'รีเซ็ตข้อมูลตัวอย่าง',

    // Hero
    heroBadge: 'ระบบจับคู่อัจฉริยะ (Automated Matching Engine)',
    heroHeading: 'ศูนย์รวมแจ้งเตือนและ\nค้นหาของหายในมหาวิทยาลัยขอนแก่น',
    heroDescription: 'ระบบช่วยจับคู่ของหายและของที่เก็บได้อัตโนมัติ แจ้งเตือนทันทีเมื่อพบรายการที่ตรงกัน ช่วยให้นักศึกษาและบุคลากรได้รับของคืนอย่างรวดเร็วและปลอดภัย',
    heroSearchPlaceholder: 'พิมพ์ค้นหาสิ่งของ (เช่น iPad, บัตรนักศึกษา, กุญแจหอพัก, ร่ม)...',
    btnSearch: 'ค้นหา',
    btnReportLostMain: 'แจ้งทำของหาย',
    btnReportFoundMain: 'แจ้งเก็บของได้',

    // Stats
    statReturnedRate: 'อัตราการส่งมอบคืนสำเร็จ',
    statReturnedCount: 'รายการที่ส่งคืนสำเร็จแล้ว',
    statActivePosts: 'รายการที่กำลังติดตามหา',
    statAvgMatchTime: 'เวลาเฉลี่ยในการจับคู่',
    statMinutes: 'นาที',
    statItems: 'ชิ้น',

    // How it works
    howItWorksTitle: 'ขั้นตอนการทำงานของระบบจับคู่อัตโนมัติ',
    howStep1Title: '1. โพสต์แจ้งข้อมูล',
    howStep1Desc: 'ระบุหมวดหมู่ อาคารในมหาวิทยาลัย วันเวลา และลักษณะเด่นของสิ่งของ',
    howStep2Title: '2. อัลกอริทึมประมวลผล',
    howStep2Desc: 'ระบบเทียบเคียงหมวดหมู่ สถานที่ วันเวลา และคีย์เวิร์ดแบบ Real-time',
    howStep3Title: '3. แจ้งเตือน & นัดรับปลอดภัย',
    howStep3Desc: 'เมื่อพบรายการที่ตรงกัน 60% ขึ้นไป ระบบจะส่งการแจ้งเตือนทันทีเพื่อประสานงานนัดรับ ณ จุดบริการที่ปลอดภัย',

    // Discovery Hub
    hubTitle: 'คลังค้นหาและติดตามของหายในมหาวิทยาลัย',
    hubSubtitle: 'ค้นหา กรอง และติดตามสถานะสิ่งของที่หายหรือเก็บได้แบบ Real-time',
    filterAll: 'ทั้งหมด',
    filterLost: 'ของหาย (Lost)',
    filterFound: 'เก็บของได้ (Found)',
    filterReturned: 'ส่งคืนสำเร็จ (Returned)',
    filterCategory: 'หมวดหมู่ทั้งหมด',
    filterBuilding: 'ทุกอาคารในมหาวิทยาลัย',
    filterDate: 'ช่วงเวลา',
    sortNewest: 'ล่าสุดก่อน',
    sortHighestMatch: 'ความน่าจะเป็นสูงสุด',
    viewGrid: 'มุมมองการ์ด',
    viewList: 'มุมมองตาราง',
    noItemsFound: 'ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา',
    btnResetFilters: 'ล้างตัวกรองทั้งหมด',

    // Item Card & Badges
    badgeLost: 'ของหาย',
    badgeFound: 'เก็บได้',
    badgeReturned: 'คืนแล้ว',
    badgePendingClaim: 'รอยืนยันสิทธิ์',
    matchScoreLabel: 'ความตรงกัน',
    btnViewDetails: 'ดูรายละเอียด',
    btnClaimItem: 'นี่คือของฉัน (ขอรับคืน)',
    locationLabel: 'สถานที่',
    dateLabel: 'วันที่แจ้ง',
    contactLabel: 'ช่องทางติดต่อ',
    handoverLabel: 'จุดฝากของปลอดภัย',

    // Modals
    modalClose: 'ปิด',
    step1: '1. ข้อมูลสิ่งของ',
    step2: '2. สถานที่ & วันเวลา',
    step3: '3. ข้อมูลติดต่อ & จุดส่งมอบ',
    btnNext: 'ถัดไป',
    btnBack: 'ย้อนกลับ',
    btnSubmitLost: 'ยืนยันแจ้งของหาย',
    btnSubmitFound: 'ยืนยันแจ้งเก็บของได้',

    // Form fields
    fieldName: 'ชื่อสิ่งของ / อุปกรณ์',
    fieldNamePlaceholder: 'เช่น iPad Air 5 สี Space Gray พร้อมเคสแม่เหล็กสีดำ',
    fieldCategory: 'หมวดหมู่',
    fieldDescription: 'รายละเอียดเพิ่มเติม / ตำหนิเด่นชัด',
    fieldDescPlaceholder: 'ระบุจุดสังเกตเฉพาะ เช่น รอยบิ่นมุมซ้าย, สติกเกอร์ลายแมว, ข้อความบนหน้าจอล็อก...',
    fieldImage: 'รูปภาพสิ่งของ (URL หรืออัปโหลดตัวอย่าง)',
    fieldImagePlaceholder: 'วาง URL รูปภาพ หรือเลือกภาพตัวอย่าง',
    fieldBuilding: 'อาคาร / สถานที่เกิดเหตุ',
    fieldFloor: 'ชั้น / ห้อง / บริเวณ',
    fieldFloorPlaceholder: 'เช่น ชั้น 3 โต๊ะอ่านหนังสือริมหน้าต่าง',
    fieldDate: 'วันที่เกิดเหตุ',
    fieldTimeRange: 'ช่วงเวลาโดยประมาณ',
    fieldTimeMorning: 'ช่วงเช้า (06:00 - 12:00)',
    fieldTimeAfternoon: 'ช่วงบ่าย (12:00 - 18:00)',
    fieldTimeEvening: 'ช่วงค่ำ (18:00 - 24:00)',
    fieldReporterName: 'ชื่อผู้แจ้ง (ชื่อเล่น / ชื่อ-นามสกุล)',
    fieldContact: 'ช่องทางติดต่อ (LINE ID หรือ เบอร์โทร)',
    fieldHandoverPoint: 'จุดฝากส่งมอบของปลอดภัยที่สะดวก',

    // Match Alert Modal
    matchAlertTitle: '🎉 ตรวจพบรายการที่น่าจะตรงกัน!',
    matchAlertSubtitle: 'ระบบ Matching Engine ตรวจพบสิ่งของที่มีความสอดคล้องกันสูงในระบบ',
    matchScore: 'ระดับความตรงกัน',
    yourReportedItem: 'สิ่งของที่คุณเพิ่งโพสต์',
    matchedCandidateItem: 'สิ่งของที่ระบบตรวจพบในคลัง',
    matchReasons: 'เหตุผลที่ระบบจับคู่ให้:',
    btnVerifyClaim: 'ตรวจสอบและดำเนินการขอรับคืน',
    btnIgnoreMatch: 'ยังไม่ใช่ / ไว้ทีหลัง',

    // Notifications
    notifTitle: 'การแจ้งเตือนระบบจับคู่',
    notifEmpty: 'ยังไม่มีการแจ้งเตือนใหม่ในขณะนี้',
    notifItemMatched: 'พบสิ่งของที่ตรงกับรายการของคุณ',
    notifMarkAllRead: 'อ่านทั้งหมดแล้ว',
    notifClear: 'ล้างการแจ้งเตือน',

    // My Tracker
    myTrackerTitle: 'รายการของฉัน & ติดตามสถานะ',
    myTrackerSubtitle: 'จัดการรายการที่คุณเคยโพสต์แจ้งไว้ และตรวจสอบผลการจับคู่',
    btnMarkReturned: 'เปลี่ยนเป็น "รับคืนแล้ว"',
    noMyPosts: 'คุณยังไม่มีรายการที่โพสต์ไว้ในระบบ',
    btnPostNow: 'เริ่มโพสต์แจ้งรายการใหม่',

    // Campus Handover
    campusDirectoryTitle: 'จุดบริการรับ-ฝากของหายปลอดภัยในมหาวิทยาลัย',
    campusDirectorySubtitle: 'เพื่อความปลอดภัย แนะนำให้นัดหมายส่งมอบของหรือฝากไว้ ณ จุดบริการทางการของมหาวิทยาลัย',

    // FAQ
    faqTitle: 'คำถามที่พบบ่อย & ข้อควรระวังด้านความปลอดภัย',
    faq1Q: 'ขั้นตอนการยืนยันความเป็นเจ้าของทำอย่างไร?',
    faq1A: 'เจ้าของตัวจริงจะต้องสามารถบอกจุดสังเกตเฉพาะที่ไม่ได้ระบุไว้ในโพสต์สาธารณะ เช่น รหัสปลดล็อกเครื่อง, รหัสซีเรียลนัมเบอร์, รูปภาพส่วนตัวในโทรศัพท์ หรือรายละเอียดสิ่งของในกระเป๋า',
    faq2Q: 'หากเก็บของมีค่าได้ควรทำอย่างไร?',
    faq2A: 'แนะนำให้นำไปฝากไว้ที่ศูนย์ประสานงานของหาย กองกิจการนักศึกษา หรือป้อม รปภ. ประจำอาคาร เพื่อให้เจ้าหน้าที่ออกใบรับฝากของอย่างเป็นทางการ',
    faq3Q: 'ระบบปกป้องความเป็นส่วนตัวอย่างไร?',
    faq3A: 'ระบบจะไม่เปิดเผยข้อมูลติดต่อส่วนบุคคลสู่สาธารณะจนกว่าจะมีการกดยืนยันการติดต่อเพื่อขอรับคืน',

    // Footer
    footerDesc: 'ระบบแจ้งเตือนและติดตามของหายในมหาวิทยาลัย (University Lost & Found Portal)',
    footerCopyright: '© 2026 LostStuff2 - พัฒนาเพื่อสนับสนุนความปลอดภัยและคอมมูนิตี้ในมหาวิทยาลัย',
    demoResetConfirm: 'ต้องการรีเซ็ตข้อมูล Mock Data กลับสู่ค่าเริ่มต้นใช่หรือไม่?'
  },

  en: {
    appTitle: 'LostStuff2',
    appSubtitle: 'University Lost & Found Portal',
    navHome: 'Home',
    navSearch: 'Discovery & Feed',
    navReportLost: 'Report Lost',
    navReportFound: 'Report Found',
    navMyReports: 'My Reports',
    navLocations: 'Safe Drop-off Zones',
    navFaq: 'Safety & FAQs',
    navResetData: 'Reset Demo Data',

    // Hero
    heroBadge: 'Automated Matching Engine Powered',
    heroHeading: 'Khon Kaen University Campus\nLost & Found Community Hub',
    heroDescription: 'An automated matching portal that instantly connects lost item reports with found belongings across campus buildings, helping students and staff recover essentials safely and swiftly.',
    heroSearchPlaceholder: 'Search items (e.g. iPad, Student ID, Dorm Keys, Umbrella)...',
    btnSearch: 'Search',
    btnReportLostMain: 'Report Lost Item',
    btnReportFoundMain: 'Report Found Item',

    // Stats
    statReturnedRate: 'Successful Return Rate',
    statReturnedCount: 'Items Successfully Reunited',
    statActivePosts: 'Active Searching Items',
    statAvgMatchTime: 'Average Match Time',
    statMinutes: 'mins',
    statItems: 'items',

    // How it works
    howItWorksTitle: 'How the Automated Matching Engine Works',
    howStep1Title: '1. Submit Item Details',
    howStep1Desc: 'Enter category, campus building, date/time window, and unique distinguishing features.',
    howStep2Title: '2. Real-Time Engine Match',
    howStep2Desc: 'Algorithm compares category, proximity, building, and keywords simultaneously.',
    howStep3Title: '3. Instant Alert & Safe Handover',
    howStep3Desc: 'When an item matches with 60% or higher confidence, instant alerts trigger to coordinate pickup at a verified campus desk.',

    // Discovery Hub
    hubTitle: 'Campus Discovery & History Hub',
    hubSubtitle: 'Search, filter, and track lost or found items across campus in real time',
    filterAll: 'All Items',
    filterLost: 'Lost Items',
    filterFound: 'Found Items',
    filterReturned: 'Returned',
    filterCategory: 'All Categories',
    filterBuilding: 'All Campus Buildings',
    filterDate: 'Date Range',
    sortNewest: 'Newest First',
    sortHighestMatch: 'Highest Match %',
    viewGrid: 'Grid View',
    viewList: 'List View',
    noItemsFound: 'No items match the current search filters.',
    btnResetFilters: 'Clear All Filters',

    // Item Card & Badges
    badgeLost: 'Lost',
    badgeFound: 'Found',
    badgeReturned: 'Returned',
    badgePendingClaim: 'Pending Claim',
    matchScoreLabel: 'Match Score',
    btnViewDetails: 'View Details',
    btnClaimItem: 'Claim This Item',
    locationLabel: 'Location',
    dateLabel: 'Date Reported',
    contactLabel: 'Contact',
    handoverLabel: 'Safe Handover Point',

    // Modals
    modalClose: 'Close',
    step1: '1. Item Info',
    step2: '2. Location & Date',
    step3: '3. Contact & Handover',
    btnNext: 'Next Step',
    btnBack: 'Back',
    btnSubmitLost: 'Confirm Lost Report',
    btnSubmitFound: 'Confirm Found Report',

    // Form fields
    fieldName: 'Item Name / Device',
    fieldNamePlaceholder: 'e.g. iPad Air 5 Space Gray with black magnetic folio',
    fieldCategory: 'Category',
    fieldDescription: 'Detailed Description / Distinct Marks',
    fieldDescPlaceholder: 'Describe scratches, stickers, lock screen wallpaper, engraving...',
    fieldImage: 'Item Image (URL or Preset)',
    fieldImagePlaceholder: 'Paste image URL or pick preset',
    fieldBuilding: 'Campus Building / Location',
    fieldFloor: 'Floor / Room / Area',
    fieldFloorPlaceholder: 'e.g. 3rd Floor, window study desk area',
    fieldDate: 'Date of Incident',
    fieldTimeRange: 'Approximate Time',
    fieldTimeMorning: 'Morning (06:00 - 12:00)',
    fieldTimeAfternoon: 'Afternoon (12:00 - 18:00)',
    fieldTimeEvening: 'Evening (18:00 - 24:00)',
    fieldReporterName: 'Reporter Name (Nickname / Full Name)',
    fieldContact: 'Contact Info (LINE ID or Phone Number)',
    fieldHandoverPoint: 'Preferred Campus Safe Drop-off Point',

    // Match Alert Modal
    matchAlertTitle: '🎉 Potential Match Detected!',
    matchAlertSubtitle: 'Our Matching Engine found high-compatibility items in the campus repository.',
    matchScore: 'Match Confidence',
    yourReportedItem: 'Your Reported Item',
    matchedCandidateItem: 'Matching Candidate in System',
    matchReasons: 'Why this matched:',
    btnVerifyClaim: 'Review & Proceed with Claim',
    btnIgnoreMatch: 'Not this item / Dismiss',

    // Notifications
    notifTitle: 'Smart Match Notifications',
    notifEmpty: 'No notifications at this time',
    notifItemMatched: 'Found an item matching your report',
    notifMarkAllRead: 'Mark all as read',
    notifClear: 'Clear notifications',

    // My Tracker
    myTrackerTitle: 'My Reports & Claim Tracker',
    myTrackerSubtitle: 'Manage your reported items and check real-time auto-match results',
    btnMarkReturned: 'Mark as Returned',
    noMyPosts: 'You have not submitted any reports yet',
    btnPostNow: 'Report an Item Now',

    // Campus Handover
    campusDirectoryTitle: 'Campus Safe Handover & Drop-off Points',
    campusDirectorySubtitle: 'For student security, please arrange handovers or drop-offs at verified official university desks.',

    // FAQ
    faqTitle: 'Frequently Asked Questions & Safety Guidelines',
    faq1Q: 'How is item ownership verified?',
    faq1A: 'Claimants must be able to specify unlisted details such as unlock passcodes, serial numbers, unique inside contents, or matching ID credentials.',
    faq2Q: 'What should I do if I find a high-value item?',
    faq2A: 'Please deliver it directly to the Central Student Affairs Office or the nearest Campus Security Booth to obtain an official deposit receipt.',
    faq3Q: 'How is user privacy protected?',
    faq3A: 'Contact details remain shielded and are only revealed when a legitimate mutual claim is verified.',

    // Footer
    footerDesc: 'University Campus Lost & Found Portal (LostStuff2)',
    footerCopyright: '© 2026 LostStuff2 - Supporting a safe and helpful campus community',
    demoResetConfirm: 'Are you sure you want to reset demo data to default settings?'
  }
}
