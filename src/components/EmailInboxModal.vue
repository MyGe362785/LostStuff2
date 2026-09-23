<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
    <!-- Backdrop Overlay -->
    <div 
      data-modal-backdrop
      aria-hidden="true"
      class="fixed inset-0 bg-brand-espresso/60 backdrop-blur-sm transition-opacity" 
    ></div>

    <!-- Modal Panel -->
    <div class="relative w-full max-w-4xl rounded-2xl bg-brand-paper shadow-warm-xl border border-brand-sand overflow-hidden z-10 my-6 flex flex-col max-h-[90vh]">
      
      <!-- Header -->
      <div class="px-5 py-3.5 bg-brand-cream/90 border-b border-brand-sand flex items-center justify-between shrink-0">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-brand-chestnut flex items-center justify-center text-white">
            <Mail class="w-4 h-4" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-sm sm:text-base text-brand-espresso">
                {{ t('emailDrawerTitle') }}
              </h3>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-cream text-brand-chestnut border border-brand-sand">
                Simulated Mailbox
              </span>
            </div>
            <p class="text-[11px] text-brand-mocha/70">
              {{ t('emailDrawerSubtitle') }}
            </p>
          </div>
        </div>

        <button 
          @click="$emit('close')"
          class="w-7 h-7 rounded-lg bg-brand-sand/60 hover:bg-brand-sand text-brand-mocha flex items-center justify-center transition-colors"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Main Layout: 2 Columns (Email List + Email Viewer) -->
      <div class="flex-1 flex flex-col sm:flex-row overflow-hidden min-h-[400px]">
        
        <!-- Left: Email List -->
        <div class="w-full sm:w-80 border-b sm:border-b-0 sm:border-r border-brand-sand/70 flex flex-col bg-brand-cream/20">
          <div class="p-3 border-b border-brand-sand/60 flex items-center justify-between text-xs text-brand-latte font-semibold">
            <span>{{ emails.length }} ข้อความ</span>
            <button 
              v-if="emails.length > 0"
              @click="$emit('clear-emails')"
              class="text-[11px] text-brand-chestnut hover:underline font-bold"
            >
              ล้างทั้งหมด
            </button>
          </div>

          <div class="overflow-y-auto flex-1 divide-y divide-brand-sand/50">
            <div v-if="emails.length === 0" class="p-8 text-center text-xs text-brand-latte">
              {{ t('emailEmpty') }}
            </div>

            <div
              v-for="email in emails"
              :key="email.id"
              @click="selectedEmail = email"
              class="p-3.5 cursor-pointer transition-colors text-left relative"
              :class="selectedEmail?.id === email.id ? 'bg-brand-sand/40 border-l-3 border-brand-chestnut' : 'hover:bg-brand-cream/50'"
            >
              <div class="flex items-center justify-between mb-1">
                <span class="text-[10px] font-mono text-brand-latte">
                  {{ formatEmailTime(email.timestamp) }}
                </span>
                <span 
                  v-if="!email.isRead"
                  class="w-2 h-2 rounded-full bg-brand-caramel"
                  title="ยังไม่อ่าน"
                ></span>
              </div>
              <h5 class="font-bold text-xs text-brand-espresso line-clamp-1 mb-0.5">
                {{ email.subject }}
              </h5>
              <p class="text-[11px] text-brand-mocha/70 line-clamp-2 leading-snug">
                {{ email.previewText }}
              </p>
            </div>
          </div>
        </div>

        <!-- Right: Selected Email Reader -->
        <div class="flex-1 flex flex-col p-5 overflow-y-auto bg-brand-paper">
          <div v-if="selectedEmail" class="space-y-4">
            
            <!-- Email Header Meta -->
            <div class="pb-4 border-b border-brand-sand/70 space-y-2">
              <h3 class="font-extrabold text-base sm:text-lg text-brand-espresso leading-snug">
                {{ selectedEmail.subject }}
              </h3>

              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-brand-mocha">
                <div>
                  <p><strong>จาก:</strong> {{ selectedEmail.fromName }} &lt;{{ selectedEmail.from }}&gt;</p>
                  <p><strong>ถึง:</strong> {{ selectedEmail.toName }} &lt;{{ selectedEmail.to }}&gt;</p>
                </div>
                <div class="text-left sm:text-right font-mono text-[11px] text-brand-latte">
                  {{ new Date(selectedEmail.timestamp).toLocaleString('th-TH') }}
                </div>
              </div>
            </div>

            <!-- Render legacy simulated-email markup as text because these messages
                 can contain user-supplied report fields. -->
            <div class="text-xs text-brand-espresso leading-relaxed whitespace-pre-line p-4 rounded-xl bg-brand-cream/20 border border-brand-sand/50">{{ selectedEmailBodyText }}</div>

            <div class="p-3 rounded-xl bg-brand-sand/30 border border-brand-tan/50 text-[11px] text-brand-mocha flex items-center gap-2">
              <ShieldCheck class="w-4 h-4 text-found shrink-0" />
              <span>
                {{ isTh ? 'นี่คืออีเมลจำลองที่ส่งโดยระบบตามเงื่อนไขใน Proposal เพื่อทดสอบความต่อเนื่องของ Flow แจ้งเตือน' : 'This simulated email validates the notification flow requirement.' }}
              </span>
            </div>

          </div>

          <div v-else class="h-full flex flex-col items-center justify-center text-center p-10 text-brand-latte">
            <Mail class="w-10 h-10 mb-2 opacity-40 text-brand-mocha" />
            <p class="text-xs font-semibold">เลือกข้อความเพื่อเปิดอ่านเนื้อหาอีเมล</p>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { X, Mail, ShieldCheck } from 'lucide-vue-next'

const props = defineProps({
  emails: {
    type: Array,
    required: true
  },
  currentLang: {
    type: String,
    default: 'th'
  },
  t: {
    type: Function,
    required: true
  }
})

defineEmits(['close', 'clear-emails'])

const isTh = ref(props.currentLang === 'th')
const selectedEmail = ref(null)
const selectedEmailBodyText = computed(() => htmlToPlainText(selectedEmail.value?.bodyHtmlTh || ''))

onMounted(() => {
  if (props.emails && props.emails.length > 0) {
    selectedEmail.value = props.emails[0]
  }
})

function formatEmailTime(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  return d.toLocaleDateString('th-TH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function htmlToPlainText(html) {
  const document = new DOMParser().parseFromString(html, 'text/html')
  document.querySelectorAll('script, style, template, noscript').forEach(node => node.remove())
  document.querySelectorAll('br').forEach(node => node.replaceWith('\n'))
  document.querySelectorAll('p, h1, h2, h3, h4, li, div, hr').forEach(node => node.append('\n'))
  return (document.body.textContent || '').replace(/\n[ \t]+/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
}
</script>
