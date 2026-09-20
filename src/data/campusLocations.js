// Campus buildings, zones, and official safe handover drop-off points

import cafeteriaLocationImage from '../../img/location1.webp'
import libraryLocationImage from '../../img/location2.webp'

export const handoverLocations = [
  {
    id: 'dorm_nine_cafeteria',
    nameTh: 'โรงอาหารหอเก้าหลัง',
    nameEn: 'Dormitory 9 Cafeteria',
    code: 'D9',
    zone: 'Dormitory Zone',
    image: cafeteriaLocationImage,
    handoverPointTh: 'จุดฝากของโรงอาหารหอเก้าหลัง',
    handoverPointEn: 'Dormitory 9 Cafeteria Drop-off Point',
    operatingHoursTh: '09.00 – 17.00 น.',
    operatingHoursEn: '09:00–17:00',
    isAvailable: true,
  },
  {
    id: 'kku_library_office',
    nameTh: 'สำนักงานหอสมุด มหาวิทยาลัยขอนแก่น',
    nameEn: 'Khon Kaen University Library Office',
    code: 'LIB',
    zone: 'Academic Zone',
    image: libraryLocationImage,
    handoverPointTh: 'เคาน์เตอร์แจ้งของหาย ชั้น 1',
    handoverPointEn: 'Lost & Found Counter, 1st Floor',
    operatingHoursTh: '09.00 – 17.00 น.',
    operatingHoursEn: '09:00–17:00',
    isAvailable: true,
  },
]

// Full campus list remains available to the report form and discovery filters.
export const campusBuildings = [
  {
    id: 'bld_library',
    nameTh: 'สำนักหอสมุดกลาง (Central Library)',
    nameEn: 'Central Library',
    code: 'LIB',
    zone: 'Academic Zone',
    floors: ['ชั้น 1 (โซนอ่านหนังสือและ Co-working)', 'ชั้น 2 (ห้องค้นคว้าและยืมคืน)', 'ชั้น 3 (โซนเงียบ & Study Room)', 'ชั้น 4 (ลานมัลติมีเดีย)'],
    handoverPointTh: 'เคาน์เตอร์บริการยืม-คืน ชั้น 1',
    handoverPointEn: 'Circulation Desk, 1st Floor',
    operatingHours: '08:00 - 21:00 น. (จันทร์ - เสาร์)'
  },
  {
    id: 'bld_sc',
    nameTh: 'อาคารเรียนรวมวิทยาศาสตร์ (SC Building)',
    nameEn: 'Science Lecture Complex (SC)',
    code: 'SC',
    zone: 'Science & Tech Zone',
    floors: ['ชั้น 1 (โถงกลาง & ใต้อาคาร)', 'ชั้น 2 (ห้องบรรยาย SC2-xxx)', 'ชั้น 3 (ห้องปฏิบัติการ SC3-xxx)', 'ชั้น 4 (ห้องเรียน SC4-xxx)'],
    handoverPointTh: 'ห้องธุรการประจำอาคาร ชั้น 1',
    handoverPointEn: 'Building Admin Office, 1st Floor',
    operatingHours: '08:30 - 17:30 น. (จันทร์ - ศุกร์)'
  },
  {
    id: 'bld_canteen',
    nameTh: 'โรงอาหารกลาง (Central Cafeteria / C1)',
    nameEn: 'Central Cafeteria (C1)',
    code: 'C1',
    zone: 'Student Life Zone',
    floors: ['ชั้น 1 (โซนร้านอาหาร & ลานรับประทาน)', 'ชั้น 2 (ร้านสะดวกซื้อ & ร้านเครื่องดื่ม)'],
    handoverPointTh: 'ป้อมประชาสัมพันธ์โรงอาหารกลาง',
    handoverPointEn: 'Information Booth, Central Cafeteria',
    operatingHours: '06:30 - 19:30 น. (ทุกวัน)'
  },
  {
    id: 'bld_sports',
    nameTh: 'ศูนย์กีฬาและโรงยิมเนเซียม (Sports Complex)',
    nameEn: 'University Sports Complex',
    code: 'GYM',
    zone: 'Athletics Zone',
    floors: ['ชั้น 1 (สระว่ายน้ำ & ลานบาสเกตบอล)', 'ชั้น 2 (ห้องฟิตเนส & ลู่วิ่งในร่ม)', 'ชั้น 3 (สนามแบดมินตัน)'],
    handoverPointTh: 'เคาน์เตอร์ลงทะเบียนเข้าใช้บริการศูนย์กีฬา',
    handoverPointEn: 'Main Reception Desk, Sports Complex',
    operatingHours: '07:00 - 21:00 น. (ทุกวัน)'
  },
  {
    id: 'bld_student_affairs',
    nameTh: 'อาคารกิจการนักศึกษาและกิจกรรม (Student Union)',
    nameEn: 'Student Affairs & Union Building',
    code: 'SU',
    zone: 'Administration Zone',
    floors: ['ชั้น 1 (ศูนย์รับแจ้งของหายกลาง & ประชาสัมพันธ์)', 'ชั้น 2 (ห้องชมรมและกิจกรรม)', 'ชั้น 3 (ห้องประชุมใหญ่)'],
    handoverPointTh: 'ศูนย์ประสานงานของหายกลาง กองกิจการนักศึกษา ชั้น 1',
    handoverPointEn: 'Central Lost & Found Office, Student Affairs 1st Floor',
    operatingHours: '08:30 - 16:30 น. (จันทร์ - ศุกร์)'
  },
  {
    id: 'bld_eng',
    nameTh: 'คณะวิศวกรรมศาสตร์ (Faculty of Engineering)',
    nameEn: 'Faculty of Engineering (ENG)',
    code: 'ENG',
    zone: 'Engineering Zone',
    floors: ['ชั้น 1 (ลานกิจกรรมเกียร์ & ลานจอดรถ)', 'ชั้น 2 (ห้องคอมพิวเตอร์ & Maker Space)', 'ชั้น 3 (ห้องบรรยาย ENG-301)'],
    handoverPointTh: 'ป้อม รปภ. หน้าตึกวิศวะ 100 ปี',
    handoverPointEn: 'Security Guard Post, ENG Centennial Bldg',
    operatingHours: '24 ชั่วโมง (รปภ.)'
  },
  {
    id: 'bld_security_gate',
    nameTh: 'ป้อมรักษาความปลอดภัยประตูหลัก (Main Security Gate)',
    nameEn: 'Main Campus Security Post',
    code: 'SEC',
    zone: 'Security Zone',
    floors: ['ป้อมควบคุม รปภ. ประตูใหญ่'],
    handoverPointTh: 'ศูนย์ปฏิบัติการรักษาความปลอดภัย 24 ชม.',
    handoverPointEn: '24/7 Campus Security Control Post',
    operatingHours: 'เปิดทำการ 24 ชั่วโมง ทุกวัน'
  }
]

export const itemCategories = [
  {
    id: 'electronics',
    nameTh: 'อุปกรณ์อิเล็กทรอนิกส์',
    nameEn: 'Electronics',
    icon: 'Laptop',
    examplesTh: 'iPad, โน้ตบุ๊ก, แท็บเล็ต, หูฟัง AirPods, พาวเวอร์แบงก์, สมาร์ทโฟน',
    examplesEn: 'iPad, Laptop, AirPods, Powerbank, Smartphone, Charger',
    color: '#A26A4A'
  },
  {
    id: 'cards_wallets',
    nameTh: 'บัตร & กระเป๋าสตางค์',
    nameEn: 'Cards & Wallets',
    icon: 'CreditCard',
    examplesTh: 'บัตรนักศึกษา, บัตรประชาชน, บัตร ATM, กระเป๋าสตางค์, กระเป๋าใส่บัตร',
    examplesEn: 'Student ID, National ID, Bank Card, Wallet, Cardholder',
    color: '#784D34'
  },
  {
    id: 'stationery_books',
    nameTh: 'เครื่องเขียน & หนังสือ',
    nameEn: 'Stationery & Books',
    icon: 'BookOpen',
    examplesTh: 'ชีทเรียน, หนังสือตำรา, สมุดโน้ต, ปากกา iPad Pencil, กล่องดินสอ',
    examplesEn: 'Textbook, Lecture Notes, Apple Pencil, Notebook, Pencil Case',
    color: '#B49A85'
  },
  {
    id: 'personal_items',
    nameTh: 'ของใช้ส่วนตัว & เสื้อผ้า',
    nameEn: 'Personal Items & Wearables',
    icon: 'Watch',
    examplesTh: 'นาฬิกา, แว่นตา, เสื้อกันหนาว, เสื้อช็อป, ร่ม, กระบอกน้ำ',
    examplesEn: 'Watch, Glasses, Jacket, University Hoodie, Umbrella, Tumbler',
    color: '#543624'
  },
  {
    id: 'keys_vehicles',
    nameTh: 'กุญแจ & ยานพาหนะ',
    nameEn: 'Keys & Vehicles',
    icon: 'Key',
    examplesTh: 'กุญแจหอพัก, กุญแจรถยนต์, กุญแจมอเตอร์ไซค์, หมวกกันน็อก',
    examplesEn: 'Dorm Key, Car Key, Motorcycle Key, Helmet, Keycard',
    color: '#D97706'
  },
  {
    id: 'others',
    nameTh: 'อื่นๆ',
    nameEn: 'Others',
    icon: 'HelpCircle',
    examplesTh: 'กระเป๋าเป้, ถุงผ้า, อุปกรณ์กีฬา, เอกสารสำคัญ',
    examplesEn: 'Backpack, Tote Bag, Sports Gear, Documents',
    color: '#6B7280'
  }
]
