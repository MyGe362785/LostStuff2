<template>
  <div class="privacy-page">
    <header class="border-b border-brand-sand bg-brand-cream/55">
      <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <button
          type="button"
          class="mb-7 inline-flex min-h-11 items-center gap-2 rounded-lg px-1 text-sm font-semibold text-brand-chestnut transition-colors hover:text-brand-espresso"
          @click="$emit('navigate-home')"
        >
          <ArrowLeft class="h-4 w-4" aria-hidden="true" />
          {{ copy.backHome }}
        </button>

        <div class="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div class="max-w-3xl">
            <div class="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-chestnut text-white shadow-warm-md">
              <LockKeyhole class="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 class="max-w-2xl text-3xl font-extrabold leading-tight tracking-[-0.03em] text-brand-espresso sm:text-4xl">
              {{ copy.title }}
            </h1>
            <p class="mt-4 max-w-[70ch] text-sm leading-7 text-brand-mocha sm:text-base">
              {{ copy.intro }}
            </p>
          </div>

          <div class="flex flex-col items-start gap-1.5 border-t border-brand-tan pt-4 text-xs text-brand-mocha lg:min-w-48 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <span class="font-semibold text-brand-espresso">{{ copy.updatedLabel }}</span>
            <time datetime="2026-09-19">{{ copy.updatedDate }}</time>
          </div>
        </div>

        <div class="mt-8 flex max-w-4xl items-start gap-3 rounded-xl bg-brand-paper px-4 py-4 shadow-warm-sm sm:px-5">
          <CircleAlert class="mt-0.5 h-5 w-5 shrink-0 text-brand-caramel" aria-hidden="true" />
          <div>
            <p class="text-sm font-bold text-brand-espresso">{{ copy.projectNoteTitle }}</p>
            <p class="mt-1 text-xs leading-6 text-brand-mocha">{{ copy.projectNote }}</p>
          </div>
        </div>
      </div>
    </header>

    <div class="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:px-8 lg:py-14">
      <aside class="min-w-0 max-w-full lg:sticky lg:top-24 lg:self-start">
        <p class="mb-3 text-xs font-bold text-brand-espresso">{{ copy.contentsLabel }}</p>
        <nav class="-mx-4 flex max-w-[calc(100vw)] gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:block lg:max-w-none lg:space-y-1 lg:overflow-visible lg:px-0" :aria-label="copy.contentsLabel">
          <a
            v-for="section in copy.sections"
            :key="section.id"
            :href="`#${section.id}`"
            class="whitespace-nowrap rounded-lg border border-brand-sand bg-brand-paper px-3 py-2 text-xs font-semibold text-brand-mocha transition-colors hover:border-brand-tan hover:bg-brand-cream hover:text-brand-espresso lg:block lg:whitespace-normal lg:border-0 lg:bg-transparent lg:px-3"
          >
            {{ section.nav }}
          </a>
        </nav>

        <div class="mt-6 hidden border-t border-brand-sand pt-5 lg:block">
          <p class="text-xs font-semibold text-brand-espresso">{{ copy.currentModeLabel }}</p>
          <p class="mt-1.5 text-xs leading-5 text-brand-mocha">
            {{ backendConfigured ? copy.backendMode : copy.demoMode }}
          </p>
        </div>
      </aside>

      <article class="min-w-0 max-w-[72ch]">
        <section
          v-for="section in copy.sections"
          :id="section.id"
          :key="section.id"
          class="scroll-mt-28 border-b border-brand-sand pb-9 pt-1 first:pt-0 last:border-b-0 last:pb-0 sm:pb-11"
        >
          <div class="flex items-start gap-3">
            <component :is="section.icon" class="mt-1 h-5 w-5 shrink-0 text-brand-caramel" aria-hidden="true" />
            <div class="min-w-0">
              <h2 class="text-xl font-bold tracking-[-0.02em] text-brand-espresso sm:text-2xl">
                {{ section.title }}
              </h2>
              <p v-if="section.lead" class="mt-3 text-sm leading-7 text-brand-mocha">
                {{ section.lead }}
              </p>
              <ul v-if="section.points" class="mt-4 space-y-3 text-sm leading-7 text-brand-mocha">
                <li v-for="point in section.points" :key="point" class="flex gap-3">
                  <span class="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-caramel" aria-hidden="true"></span>
                  <span>{{ point }}</span>
                </li>
              </ul>
              <div v-if="section.note" class="mt-5 rounded-xl bg-brand-cream px-4 py-4 text-xs leading-6 text-brand-mocha">
                <strong class="font-bold text-brand-espresso">{{ section.noteTitle }}</strong>
                {{ section.note }}
              </div>
            </div>
          </div>
        </section>

        <div class="mt-10 flex flex-col gap-4 rounded-xl bg-brand-mocha px-5 py-6 text-brand-paper shadow-warm-lg sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p class="text-base font-bold">{{ copy.endTitle }}</p>
            <p class="mt-1 text-xs leading-5 text-brand-cream/80">{{ copy.endDescription }}</p>
          </div>
          <button
            type="button"
            class="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-brand-paper px-4 py-2.5 text-xs font-bold text-brand-espresso transition-colors hover:bg-brand-cream"
            @click="$emit('navigate-home')"
          >
            {{ copy.backHome }}
            <ArrowRight class="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  ArrowLeft,
  ArrowRight,
  CircleAlert,
  Clock3,
  Database,
  Eye,
  FileText,
  LockKeyhole,
  Network,
  ShieldCheck,
  UserRoundCheck,
} from 'lucide-vue-next'

const props = defineProps({
  currentLang: { type: String, default: 'th' },
  backendConfigured: { type: Boolean, default: false },
})

defineEmits(['navigate-home'])

const copy = computed(() => {
  if (props.currentLang === 'en') {
    return {
      title: 'Privacy Policy',
      intro: 'This notice explains what information Foundit-KKU uses when you report, search for, or claim lost property, including how the demo and configured service modes differ.',
      backHome: 'Back to home',
      updatedLabel: 'Last updated',
      updatedDate: '19 September 2026',
      projectNoteTitle: 'About this service',
      projectNote: 'Foundit-KKU is a student project and is not an official Khon Kaen University service. Before a production launch, the operator must publish its legal identity and a verified privacy contact.',
      contentsLabel: 'On this page',
      currentModeLabel: 'Current environment',
      demoMode: 'Demo mode: report and claim data is stored in this browser.',
      backendMode: 'Configured mode: authentication and service data are handled through Supabase.',
      endTitle: 'Ready to continue?',
      endDescription: 'Return to the search hub to browse or report an item.',
      sections: [
        {
          id: 'scope', nav: 'Scope', title: 'What this notice covers', icon: FileText,
          lead: 'This notice covers the Foundit-KKU website and the information used to publish lost-and-found reports, match related reports, verify ownership claims, notify users, and let staff review cases.',
        },
        {
          id: 'data', nav: 'Information used', title: 'Information the system may use', icon: Database,
          lead: 'The information depends on the action you choose to take.',
          points: [
            'Account details, such as your Google account email, display name, role, and sign-in session when the backend is enabled.',
            'Report details, such as item type, title, category, colour, brand, identifying marks, description, image, place, date, time, and handover point.',
            'Contact and claim details, such as reporter contact, claimant name, student or identity reference, private proof, preferred contact channel, and review status.',
            'Operational records, such as notifications, case status changes, staff notes, and audit timestamps.',
            'In demo mode, sample reports, claims, simulated emails, and audit records saved in your browser storage.',
          ],
        },
        {
          id: 'purpose', nav: 'Purposes', title: 'Why the information is used', icon: Eye,
          points: [
            'To create and display reports, search and filter items, and calculate possible matches.',
            'To contact relevant users, process ownership claims, and coordinate safe return of property.',
            'To moderate submissions, review evidence, prevent misuse, and keep an operational history for staff.',
            'To maintain authentication, service continuity, and basic troubleshooting.',
          ],
        },
        {
          id: 'access', nav: 'Access and disclosure', title: 'Who can see the information', icon: UserRoundCheck,
          lead: 'Public reports are designed to show item and event details needed for discovery. Private contact details and claim evidence are not intended for public display.',
          points: [
            'Report owners can access their own reports and related records.',
            'A claimant can access their own claim; authorised staff can review claims, contact details, and case records required to handle the report.',
            'Information may be disclosed when required by applicable law or when necessary to protect users, property, or the service.',
          ],
          noteTitle: 'Share carefully. ',
          note: 'Do not put passwords, unlock codes, complete government ID numbers, financial data, or unnecessary sensitive information in a public description.',
        },
        {
          id: 'storage', nav: 'Storage and retention', title: 'Where information is kept and for how long', icon: Clock3,
          points: [
            'In demo mode, data remains in browser storage until you reset the demo, clear site data, or remove it through browser controls.',
            'When the backend is configured, account and service records are stored through Supabase. Item images are served through time-limited signed links where configured.',
            'No fixed retention period is implemented in this project version. A production operator must define, publish, and enforce retention and deletion schedules before launch.',
          ],
        },
        {
          id: 'security', nav: 'Security', title: 'How information is protected', icon: ShieldCheck,
          lead: 'The configured service uses account authentication, role-based access, database access policies, and restricted records for contact and claim details. No online system can guarantee complete security, so users should submit only information needed for the case.',
        },
        {
          id: 'rights', nav: 'Your choices', title: 'Your choices and privacy rights', icon: UserRoundCheck,
          lead: 'Depending on applicable law and the production operator’s role, you may be able to request access, correction, deletion, restriction, objection, portability, or withdrawal of consent where consent is used.',
          points: [
            'You can avoid submitting a report or claim if you do not want to provide the requested details.',
            'In demo mode, use “Reset Demo Data” or browser site-data controls to remove locally stored records.',
            'Requests involving configured service data must be verified before records are changed or disclosed.',
          ],
        },
        {
          id: 'services', nav: 'External services', title: 'Services involved', icon: Network,
          lead: 'The configured version may use Google for sign-in and Supabase for authentication, database, and file storage. Demo content can also display sample images hosted by Unsplash. Those services process information under their own terms and privacy practices.',
        },
        {
          id: 'contact', nav: 'Contact and changes', title: 'Questions, requests, and policy changes', icon: LockKeyhole,
          lead: 'The current project does not publish a verified data-controller or data-protection contact. Before production use, the operator must add a working contact channel and response process. Material changes to this notice should be dated and shown clearly on this page.',
        },
      ],
    }
  }

  return {
    title: 'นโยบายความเป็นส่วนตัว',
    intro: 'คำชี้แจงนี้อธิบายข้อมูลที่ Foundit-KKU ใช้เมื่อคุณแจ้ง ค้นหา หรือยื่นขอรับคืนสิ่งของ รวมถึงความแตกต่างระหว่างโหมดสาธิตและโหมดที่เชื่อมต่อระบบหลังบ้าน',
    backHome: 'กลับหน้าหลัก',
    updatedLabel: 'ปรับปรุงล่าสุด',
    updatedDate: '19 กันยายน 2569',
    projectNoteTitle: 'เกี่ยวกับบริการนี้',
    projectNote: 'Foundit-KKU เป็นโครงงานของนักศึกษา ไม่ใช่ระบบทางการของมหาวิทยาลัยขอนแก่น ก่อนนำไปใช้งานจริง ผู้ดำเนินการต้องระบุตัวตนทางกฎหมายและช่องทางติดต่อด้านข้อมูลส่วนบุคคลที่ตรวจสอบได้',
    contentsLabel: 'หัวข้อในหน้านี้',
    currentModeLabel: 'สภาพแวดล้อมปัจจุบัน',
    demoMode: 'โหมดสาธิต: ข้อมูลรายการและคำขอรับคืนจัดเก็บอยู่ในเบราว์เซอร์นี้',
    backendMode: 'โหมดเชื่อมต่อ: การเข้าสู่ระบบและข้อมูลบริการจัดการผ่าน Supabase',
    endTitle: 'พร้อมใช้งานต่อแล้วหรือยัง?',
    endDescription: 'กลับไปยังคลังค้นหาเพื่อดูรายการหรือแจ้งสิ่งของ',
    sections: [
      {
        id: 'scope', nav: 'ขอบเขต', title: 'นโยบายนี้ครอบคลุมอะไร', icon: FileText,
        lead: 'นโยบายนี้ครอบคลุมเว็บไซต์ Foundit-KKU และข้อมูลที่ใช้เพื่อเผยแพร่รายการของหายและของที่พบ จับคู่รายการ ยืนยันความเป็นเจ้าของ แจ้งเตือนผู้ใช้ และให้เจ้าหน้าที่ตรวจสอบเคส',
      },
      {
        id: 'data', nav: 'ข้อมูลที่ใช้', title: 'ข้อมูลที่ระบบอาจใช้', icon: Database,
        lead: 'ประเภทข้อมูลขึ้นอยู่กับกิจกรรมที่คุณเลือกใช้ในระบบ',
        points: [
          'ข้อมูลบัญชี เช่น อีเมลบัญชี Google ชื่อที่แสดง บทบาท และเซสชันการเข้าสู่ระบบ เมื่อเปิดใช้ระบบหลังบ้าน',
          'ข้อมูลรายการ เช่น ประเภท ชื่อ หมวดหมู่ สี ยี่ห้อ จุดสังเกต รายละเอียด รูปภาพ สถานที่ วันที่ เวลา และจุดส่งมอบ',
          'ข้อมูลติดต่อและคำขอรับคืน เช่น ช่องทางติดต่อผู้แจ้ง ชื่อผู้ยื่น รหัสนักศึกษาหรือข้อมูลอ้างอิง หลักฐานส่วนตัว ช่องทางติดต่อที่สะดวก และผลการตรวจสอบ',
          'ข้อมูลการดำเนินงาน เช่น การแจ้งเตือน การเปลี่ยนสถานะ หมายเหตุของเจ้าหน้าที่ และเวลาที่บันทึกกิจกรรม',
          'ในโหมดสาธิต ระบบบันทึกรายการ คำขอรับคืน อีเมลจำลอง และประวัติการทำงานไว้ในพื้นที่จัดเก็บของเบราว์เซอร์',
        ],
      },
      {
        id: 'purpose', nav: 'วัตถุประสงค์', title: 'ระบบใช้ข้อมูลเพื่ออะไร', icon: Eye,
        points: [
          'สร้างและแสดงรายการ ค้นหาและกรองสิ่งของ รวมถึงคำนวณรายการที่อาจตรงกัน',
          'ติดต่อผู้ที่เกี่ยวข้อง ตรวจสอบคำขอรับคืน และประสานการส่งมอบอย่างปลอดภัย',
          'กลั่นกรองรายการ ตรวจสอบหลักฐาน ป้องกันการใช้งานผิดวัตถุประสงค์ และเก็บประวัติการดำเนินงานของเจ้าหน้าที่',
          'รักษาสถานะการเข้าสู่ระบบ ความต่อเนื่องของบริการ และตรวจสอบปัญหาเบื้องต้น',
        ],
      },
      {
        id: 'access', nav: 'การเข้าถึงและเปิดเผย', title: 'ใครเข้าถึงข้อมูลได้บ้าง', icon: UserRoundCheck,
        lead: 'รายการสาธารณะจะแสดงรายละเอียดสิ่งของและเหตุการณ์เท่าที่จำเป็นต่อการค้นหา ส่วนข้อมูลติดต่อส่วนตัวและหลักฐานการขอรับคืนไม่ได้ออกแบบให้แสดงต่อสาธารณะ',
        points: [
          'เจ้าของรายการเข้าถึงรายการและข้อมูลที่เกี่ยวข้องกับตนเองได้',
          'ผู้ยื่นคำขอเข้าถึงคำขอของตนเอง และเจ้าหน้าที่ที่ได้รับอนุญาตตรวจสอบหลักฐาน ข้อมูลติดต่อ และประวัติเคสที่จำเป็นได้',
          'ระบบอาจเปิดเผยข้อมูลเมื่อกฎหมายกำหนด หรือเมื่อจำเป็นเพื่อคุ้มครองผู้ใช้ ทรัพย์สิน หรือความปลอดภัยของบริการ',
        ],
        noteTitle: 'แชร์เท่าที่จำเป็น: ',
        note: 'อย่าใส่รหัสผ่าน รหัสปลดล็อก เลขบัตรราชการแบบเต็ม ข้อมูลทางการเงิน หรือข้อมูลละเอียดอ่อนที่ไม่จำเป็นลงในรายละเอียดสาธารณะ',
      },
      {
        id: 'storage', nav: 'การจัดเก็บ', title: 'ข้อมูลอยู่ที่ไหนและเก็บไว้นานเพียงใด', icon: Clock3,
        points: [
          'ในโหมดสาธิต ข้อมูลจะอยู่ในพื้นที่จัดเก็บของเบราว์เซอร์จนกว่าคุณจะรีเซ็ตข้อมูลตัวอย่าง ล้างข้อมูลเว็บไซต์ หรือลบผ่านการตั้งค่าของเบราว์เซอร์',
          'เมื่อเชื่อมต่อระบบหลังบ้าน ข้อมูลบัญชีและข้อมูลบริการจัดเก็บผ่าน Supabase และรูปภาพสิ่งของอาจแสดงผ่านลิงก์ที่มีอายุจำกัด',
          'โครงงานรุ่นนี้ยังไม่ได้กำหนดระยะเวลาเก็บข้อมูลแบบตายตัว ผู้ดำเนินการจริงต้องกำหนด ประกาศ และบังคับใช้นโยบายการเก็บและลบข้อมูลก่อนเปิดบริการ',
        ],
      },
      {
        id: 'security', nav: 'ความปลอดภัย', title: 'ระบบปกป้องข้อมูลอย่างไร', icon: ShieldCheck,
        lead: 'โหมดเชื่อมต่อใช้การยืนยันตัวตน การกำหนดสิทธิ์ตามบทบาท นโยบายควบคุมการเข้าถึงฐานข้อมูล และการแยกข้อมูลติดต่อกับหลักฐานคำขอรับคืน อย่างไรก็ตาม ไม่มีระบบออนไลน์ใดรับประกันความปลอดภัยได้ทั้งหมด จึงควรส่งเฉพาะข้อมูลที่จำเป็นต่อเคส',
      },
      {
        id: 'rights', nav: 'สิทธิและทางเลือก', title: 'ทางเลือกและสิทธิของคุณ', icon: UserRoundCheck,
        lead: 'ภายใต้กฎหมายที่ใช้บังคับและบทบาทของผู้ดำเนินการจริง คุณอาจมีสิทธิขอเข้าถึง แก้ไข ลบ จำกัดหรือคัดค้านการใช้ข้อมูล ขอรับสำเนา หรือถอนความยินยอมในกรณีที่ระบบอาศัยความยินยอม',
        points: [
          'คุณสามารถเลือกไม่ส่งรายการหรือคำขอรับคืน หากไม่ต้องการให้ข้อมูลที่ระบบร้องขอ',
          'ในโหมดสาธิต ใช้ปุ่ม “รีเซ็ตข้อมูลตัวอย่าง” หรือการตั้งค่าข้อมูลเว็บไซต์ของเบราว์เซอร์เพื่อลบข้อมูลในเครื่อง',
          'คำขอเกี่ยวกับข้อมูลในระบบหลังบ้านต้องผ่านการยืนยันตัวตนก่อนแก้ไขหรือเปิดเผยข้อมูล',
        ],
      },
      {
        id: 'services', nav: 'บริการภายนอก', title: 'บริการภายนอกที่เกี่ยวข้อง', icon: Network,
        lead: 'เวอร์ชันที่เชื่อมต่ออาจใช้ Google สำหรับการเข้าสู่ระบบ และ Supabase สำหรับการยืนยันตัวตน ฐานข้อมูล และพื้นที่เก็บไฟล์ ส่วนข้อมูลสาธิตอาจแสดงภาพตัวอย่างจาก Unsplash บริการเหล่านี้ประมวลผลข้อมูลตามข้อกำหนดและนโยบายของตนเอง',
      },
      {
        id: 'contact', nav: 'ติดต่อและการเปลี่ยนแปลง', title: 'คำถาม คำขอ และการเปลี่ยนแปลงนโยบาย', icon: LockKeyhole,
        lead: 'โครงงานรุ่นปัจจุบันยังไม่ได้ประกาศผู้ควบคุมข้อมูลหรือช่องทางติดต่อด้านข้อมูลส่วนบุคคลที่ตรวจสอบได้ ก่อนใช้งานจริง ผู้ดำเนินการต้องเพิ่มช่องทางติดต่อและขั้นตอนตอบรับคำขอ หากมีการเปลี่ยนแปลงสาระสำคัญ ควรระบุวันที่และแสดงให้เห็นชัดเจนในหน้านี้',
      },
    ],
  }
})
</script>

<style scoped>
.privacy-page {
  scroll-behavior: smooth;
}

.privacy-page ::selection {
  background: #d8cabf;
  color: #2d2016;
}
</style>
