// Simulated Email Notification Service
// Required by Proposal Section 4: "ระบบแจ้งเตือน: การแจ้งเตือนภายในระบบและอีเมล"

import { ref } from 'vue'

const EMAIL_STORAGE_KEY = 'loststuff2_emails_v1'

export const initialMockEmails = [
  {
    id: 'email-001',
    timestamp: '2026-09-01T12:35:00Z',
    to: 'kittisak_eng@univ.ac.th',
    toName: 'กิตติศักดิ์ (นิสิตวิศวะ)',
    from: 'lostfound-system@univ.ac.th',
    fromName: 'ระบบแจ้งเตือนของหาย มหาวิทยาลัยขอนแก่น',
    subject: '[Foundit-KKU] แจ้งเตือนด่วน: พบคู่ตรงของหายของคุณในระบบ (ความใกล้เคียง 92%)',
    previewText: 'ระบบตรวจพบหูฟังเคสสีดำ AirPods Pro 2 พบที่ห้อง SC-205 ตรงกับรายการที่คุณแจ้ง...',
    bodyHtmlTh: `
      <div style="font-family: 'Kanit', 'Segoe UI', sans-serif; color: #2D2016; line-height: 1.6;">
        <h2 style="color: #784D34;">แจ้งเตือนผลการจับคู่อัตโนมัติ (Automated Match)</h2>
        <p>เรียน คุณกิตติศักดิ์,</p>
        <p>ระบบแจ้งเตือนและติดตามของหายในมหาวิทยาลัย ได้ตรวจพบสิ่งของที่มีคุณลักษณะใกล้เคียงกับ <strong>หูฟังไร้สาย AirPods Pro 2</strong> ที่คุณได้แจ้งไว้:</p>
        <div style="background-color: #F5F0EB; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p style="margin: 0 0 8px 0;"><strong>รายการที่พบ:</strong> พบหูฟังเคสสีดำ AirPods Pro 2 พร้อมตะขอเงิน (#item-008)</p>
          <p style="margin: 0 0 8px 0;"><strong>สถานที่พบ:</strong> อาคารเรียนรวม SC โต๊ะเลคเชอร์ SC-205</p>
          <p style="margin: 0 0 8px 0;"><strong>ระดับความตรงกัน:</strong> 92% (หมวดหมู่, สีดำ, อาคาร SC, วันที่, สลักชื่อ)</p>
          <p style="margin: 0;"><strong>จุดรับมอบ:</strong> ห้องธุรการประจำอาคาร SC ชั้น 1 สำนักวิชาการ</p>
        </div>
        <p>กรุณาเตรียมบัตรนักศึกษาและติดต่อขอรับคืน หรือกดยืนยันความเป็นเจ้าของผ่านระบบเว็บแอปพลิเคชัน</p>
        <hr style="border: 0; border-top: 1px solid #ECE5DE; margin: 20px 0;" />
        <small style="color: #784D34;">อีเมลนี้ส่งโดยระบบอัตโนมัติของศูนย์ประสานงานของหายมหาวิทยาลัย</small>
      </div>
    `,
    isRead: false,
    badgeType: 'match'
  },
  {
    id: 'email-002',
    timestamp: '2026-09-02T16:50:00Z',
    to: 'tidarat_edu@univ.ac.th',
    toName: 'นางสาวธิดารัตน์ (นิสิตศึกษาศาสตร์)',
    from: 'library-helpdesk@univ.ac.th',
    fromName: 'สำนักหอสมุดกลาง มหาวิทยาลัยขอนแก่น',
    subject: '[Foundit-KKU] ยืนยันการส่งมอบคืนสิ่งของสำเร็จ (#item-006 ร่มพับ MUJI)',
    previewText: 'เจ้าหน้าที่ได้บันทึกการส่งมอบคืนสิ่งของแก่ท่านเรียบร้อยแล้ว ณ เคาน์เตอร์ยืม-คืน...',
    bodyHtmlTh: `
      <div style="font-family: 'Kanit', 'Segoe UI', sans-serif; color: #2D2016; line-height: 1.6;">
        <h2 style="color: #15803D;">ยืนยันการส่งมอบคืนสิ่งของสำเร็จ</h2>
        <p>เรียน คุณธิดารัตน์,</p>
        <p>เจ้าหน้าที่ประจำเคาน์เตอร์บริการยืม-คืน สำนักหอสมุดกลาง ได้ส่งมอบ <strong>ร่มพับอัตโนมัติ MUJI สีน้ำเงินเข้ม ด้ามไม้ (#item-006)</strong> คืนให้แก่ท่านเรียบร้อยแล้ว</p>
        <p>ระบบได้ทำการเปลี่ยนสถานะรายการเป็น <strong>"ส่งคืนแล้ว (Returned)"</strong> และบันทึกประวัติการดำเนินงาน (Audit Log) เรียบร้อยแล้ว</p>
        <p>ขอขอบคุณที่ใช้บริการระบบติดตามของหายของมหาวิทยาลัย</p>
      </div>
    `,
    isRead: true,
    badgeType: 'return'
  }
]

export function loadEmails() {
  const saved = localStorage.getItem(EMAIL_STORAGE_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      return [...initialMockEmails]
    }
  }
  localStorage.setItem(EMAIL_STORAGE_KEY, JSON.stringify(initialMockEmails))
  return [...initialMockEmails]
}

export function saveEmails(emails) {
  localStorage.setItem(EMAIL_STORAGE_KEY, JSON.stringify(emails))
}

export function resetEmails() {
  const freshEmails = JSON.parse(JSON.stringify(initialMockEmails))
  localStorage.setItem(EMAIL_STORAGE_KEY, JSON.stringify(freshEmails))
  return freshEmails
}

export function dispatchEmail({ to, toName, subject, previewText, bodyHtmlTh, badgeType = 'info' }) {
  const current = loadEmails()
  const newEmail = {
    id: `email-${Date.now()}`,
    timestamp: new Date().toISOString(),
    to,
    toName: toName || 'นักศึกษา / ผู้ใช้งาน',
    from: 'noreply-lostfound@univ.ac.th',
    fromName: 'ระบบแจ้งเตือนของหายมหาวิทยาลัย',
    subject,
    previewText,
    bodyHtmlTh,
    isRead: false,
    badgeType
  }
  const updated = [newEmail, ...current]
  saveEmails(updated)
  return newEmail
}
