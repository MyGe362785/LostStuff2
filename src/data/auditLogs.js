// Staff Operational Audit Log Trail
// Required by Proposal Section 3.2: เก็บประวัติการดำเนินงานที่จำเป็นสำหรับเจ้าหน้าที่

export const initialAuditLogs = [
  {
    id: 'log-001',
    timestamp: '2026-09-02T16:45:00Z',
    staffName: 'พี่วรรณา (บรรณารักษ์หอสมุดกลาง)',
    actionType: 'return_confirmed',
    actionLabelTh: 'ยืนยันการส่งมอบคืนสำเร็จ',
    actionLabelEn: 'Handover Return Confirmed',
    itemId: 'item-006',
    itemTitle: 'ร่มพับอัตโนมัติ ด้ามจับไม้แท้ MUJI',
    claimantInfo: 'นางสาวธิดารัตน์ (นิสิตคณะศึกษาศาสตร์ รหัส 6530xxx)',
    notes: 'เจ้าของนำบัตรนักศึกษามาแสดงตนและระบุลักษณะสายหนังคล้องมือตรงตามข้อมูล รับมอบคืน ณ เคาน์เตอร์ยืม-คืน หอสมุด',
    statusBadgeClass: 'bg-green-100 text-green-800 border-green-200'
  },
  {
    id: 'log-002',
    timestamp: '2026-09-02T13:00:00Z',
    staffName: 'รปภ. สมเกียรติ (ป้อมโรงอาหารกลาง C1)',
    actionType: 'claim_received',
    actionLabelTh: 'รับเรื่องยื่นขอรับคืน (รอยืนยัน)',
    actionLabelEn: 'Claim Verification Pending',
    itemId: 'item-002',
    itemTitle: 'บัตรนักศึกษา & กระเป๋าใส่บัตร Coach',
    claimantInfo: 'นายภัทรพล (นิสิตคณะวิทยาการจัดการ รหัส 66xxxxxx)',
    notes: 'มีผู้ส่งคำร้องยื่นขอรับคืน ระบุเลขท้ายบัตรและชนิดบัตรด้านใน รอเข้ามารับตัวจริงที่ป้อม รปภ.',
    statusBadgeClass: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  {
    id: 'log-003',
    timestamp: '2026-09-01T13:10:00Z',
    staffName: 'เจ้าหน้าที่ธุรการประจำอาคาร SC',
    actionType: 'match_approved',
    actionLabelTh: 'ยืนยันการจับคู่สำเร็จ (Matched)',
    actionLabelEn: 'Match Verified',
    itemId: 'item-003',
    itemTitle: 'AirPods Pro 2 เคสซิลิโคนสีดำ',
    claimantInfo: 'กิตติศักดิ์ (นิสิตวิศวะ) จับคู่กับอาจารย์ภาควิชาฟิสิกส์ (#item-008)',
    notes: 'ระบบจับคู่ตรงกัน 92% จากสถานที่ SC-205 และตัวอักษรสลัก K.N. ตรงกัน ส่งแจ้งเตือนประสานงานนัดรับที่ห้องธุรการ',
    statusBadgeClass: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    id: 'log-004',
    timestamp: '2026-08-28T15:00:00Z',
    staffName: 'นายธีรเดช (ผู้ดูแลระบบกลาง)',
    actionType: 'case_closed',
    actionLabelTh: 'ปิดรายการเคสสำเร็จ',
    actionLabelEn: 'Case Closed',
    itemId: 'item-009',
    itemTitle: 'กระติกน้ำ Stanley สีขาว',
    claimantInfo: 'ปวีณา (ผู้แจ้ง)',
    notes: 'ผู้แจ้งแจ้งปิดเคสเนื่องจากพบสิ่งของที่ลืมไว้ด้วยตนเองเรียบร้อย',
    statusBadgeClass: 'bg-gray-100 text-gray-800 border-gray-200'
  }
]
