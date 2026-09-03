<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
    <!-- Backdrop Overlay -->
    <div 
      class="fixed inset-0 bg-brand-espresso/60 backdrop-blur-sm transition-opacity" 
      @click="$emit('close')"
    ></div>

    <!-- Modal Panel -->
    <div class="relative w-full max-w-4xl rounded-2xl bg-brand-paper shadow-warm-xl border border-brand-sand overflow-hidden z-10 my-6 flex flex-col max-h-[92vh]">
      
      <!-- Header -->
      <div class="px-5 py-4 bg-brand-cream/90 border-b border-brand-sand flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-brand-chestnut flex items-center justify-center text-white shadow-warm-sm">
            <ShieldCheck class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-base text-brand-espresso">
                {{ t('staffTitle') }}
              </h3>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                Staff / Admin Mode
              </span>
            </div>
            <p class="text-xs text-brand-mocha/70 mt-0.5">
              {{ t('staffSubtitle') }}
            </p>
          </div>
        </div>

        <button 
          @click="$emit('close')"
          class="w-8 h-8 rounded-lg bg-brand-sand/60 hover:bg-brand-sand text-brand-mocha flex items-center justify-center transition-colors"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Navigation Tabs Inside Staff Portal -->
      <div class="px-5 bg-brand-sand/30 border-b border-brand-sand/60 flex items-center gap-2 sm:gap-4 overflow-x-auto text-xs font-bold">
        <button
          @click="currentTab = 'pending'"
          class="py-3 border-b-2 flex items-center gap-1.5 transition-colors shrink-0"
          :class="currentTab === 'pending' ? 'border-brand-chestnut text-brand-chestnut' : 'border-transparent text-brand-mocha/70 hover:text-brand-espresso'"
        >
          <Inbox class="w-4 h-4" />
          <span>{{ t('staffTabPending') }}</span>
          <span class="px-1.5 py-0.2 rounded-full text-[10px] font-bold" :class="pendingItems.length > 0 ? 'bg-lost text-white' : 'bg-brand-sand text-brand-mocha'">
            {{ pendingItems.length }}
          </span>
        </button>

        <button
          @click="currentTab = 'active'"
          class="py-3 border-b-2 flex items-center gap-1.5 transition-colors shrink-0"
          :class="currentTab === 'active' ? 'border-brand-chestnut text-brand-chestnut' : 'border-transparent text-brand-mocha/70 hover:text-brand-espresso'"
        >
          <CheckSquare class="w-4 h-4" />
          <span>{{ t('staffTabActive') }}</span>
          <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-brand-sand text-brand-mocha font-bold">
            {{ activeItems.length }}
          </span>
        </button>

        <button
          @click="currentTab = 'audit'"
          class="py-3 border-b-2 flex items-center gap-1.5 transition-colors shrink-0"
          :class="currentTab === 'audit' ? 'border-brand-chestnut text-brand-chestnut' : 'border-transparent text-brand-mocha/70 hover:text-brand-espresso'"
        >
          <FileText class="w-4 h-4" />
          <span>{{ t('staffTabAudit') }}</span>
          <span class="px-1.5 py-0.2 rounded-full text-[10px] bg-brand-sand text-brand-mocha font-bold">
            {{ auditLogs.length }}
          </span>
        </button>
      </div>

      <!-- Scrollable Tab Content -->
      <div class="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
        
        <!-- TAB 1: PENDING REVIEW QUEUE -->
        <div v-if="currentTab === 'pending'" class="space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-sm text-brand-espresso">
              {{ isTh ? 'รายการแจ้งใหม่ที่รอเจ้าหน้าที่ตรวจสอบความถูกต้อง' : 'New Reports Awaiting Staff Verification' }}
            </h4>
            <span class="text-xs text-brand-latte font-medium">
              {{ pendingItems.length }} {{ isTh ? 'รายการ' : 'items' }}
            </span>
          </div>

          <div v-if="pendingItems.length === 0" class="py-12 text-center bg-brand-cream/40 rounded-xl border border-brand-sand p-6">
            <CheckCircle2 class="w-8 h-8 text-found mx-auto mb-2" />
            <p class="text-xs font-bold text-brand-espresso">
              {{ isTh ? 'ไม่มีรายการค้างตรวจสอบในขณะนี้' : 'No items pending review' }}
            </p>
            <p class="text-[11px] text-brand-latte mt-1">
              {{ isTh ? 'ทุกรายการได้รับการตรวจสอบและอนุมัติขึ้นสู่ระบบสาธารณะเรียบร้อยแล้ว' : 'All reported items are approved and active in portal.' }}
            </p>
          </div>

          <div v-else class="space-y-3">
            <div 
              v-for="item in pendingItems" 
              :key="item.id"
              class="p-4 rounded-xl bg-brand-paper border border-amber-200 bg-amber-50/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div class="flex items-start gap-3 min-w-0">
                <img :src="item.imageUrl" alt="" class="w-16 h-16 rounded-lg object-cover border border-brand-sand shrink-0" />
                <div class="min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      {{ t('statusPendingReview') }}
                    </span>
                    <span class="text-[11px] text-brand-latte font-mono">ID: #{{ item.id }}</span>
                    <span class="text-[11px] text-brand-mocha font-semibold">({{ item.type === 'lost' ? t('badgeLost') : t('badgeFound') }})</span>
                  </div>
                  <h5 class="font-bold text-sm text-brand-espresso truncate">
                    {{ isTh ? item.titleTh : item.titleEn }}
                  </h5>
                  <p class="text-xs text-brand-mocha/80 line-clamp-1 mt-0.5">
                    {{ item.colorNameTh ? `สี: ${item.colorNameTh} • ` : '' }}
                    {{ item.brand ? `ยี่ห้อ: ${item.brand} • ` : '' }}
                    {{ isTh ? item.locationDetailTh : item.locationDetailEn }}
                  </p>
                  <p class="text-[11px] text-brand-latte mt-1">
                    ผู้แจ้ง: {{ item.reporterName }} ({{ item.reporterContact }})
                  </p>
                </div>
              </div>

              <!-- Action buttons -->
              <div class="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                <button
                  @click="handleReject(item)"
                  class="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors"
                >
                  {{ t('staffBtnReject') }}
                </button>
                <button
                  @click="handleApprove(item)"
                  class="px-3.5 py-1.5 rounded-lg bg-found hover:bg-found-dark text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-warm-sm"
                >
                  <CheckCircle2 class="w-3.5 h-3.5" />
                  <span>{{ t('staffBtnApprove') }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 2: ACTIVE ITEMS & RETURN HANDOVER -->
        <div v-else-if="currentTab === 'active'" class="space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="font-bold text-sm text-brand-espresso">
              {{ isTh ? 'จัดการสถานะและยืนยันการส่งมอบคืนสิ่งของ' : 'Active Items & Handover Confirmation' }}
            </h4>
          </div>

          <div class="space-y-3">
            <div 
              v-for="item in activeItems" 
              :key="item.id"
              class="p-4 rounded-xl bg-brand-paper border border-brand-sand flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div class="flex items-start gap-3 min-w-0">
                <img :src="item.imageUrl" alt="" class="w-14 h-14 rounded-lg object-cover border border-brand-sand shrink-0" />
                <div class="min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span 
                      class="px-2 py-0.5 rounded text-[10px] font-bold"
                      :class="getStatusBadgeClass(item.status, item.type)"
                    >
                      {{ getStatusLabel(item.status, item.type) }}
                    </span>
                    <span class="text-[11px] text-brand-latte font-mono">ID: #{{ item.id }}</span>
                  </div>
                  <h5 class="font-bold text-sm text-brand-espresso truncate">
                    {{ isTh ? item.titleTh : item.titleEn }}
                  </h5>
                  <p class="text-xs text-brand-mocha/80 truncate mt-0.5">
                    {{ isTh ? item.locationDetailTh : item.locationDetailEn }}
                  </p>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                <button
                  v-if="item.status !== 'returned'"
                  @click="openConfirmReturnModal(item)"
                  class="px-3.5 py-1.5 rounded-lg bg-brand-chestnut hover:bg-brand-mocha text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-warm-sm"
                >
                  <ShieldCheck class="w-3.5 h-3.5" />
                  <span>{{ t('staffBtnConfirmReturn') }}</span>
                </button>
                <span v-else class="text-xs font-bold text-found flex items-center gap-1">
                  <CheckCircle2 class="w-4 h-4" />
                  <span>{{ t('statusReturned') }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 3: AUDIT LOGS (Proposal 3.2: เก็บประวัติการดำเนินงานสำหรับเจ้าหน้าที่) -->
        <div v-else-if="currentTab === 'audit'" class="space-y-4">
          <div>
            <h4 class="font-bold text-sm text-brand-espresso">
              {{ t('staffAuditLogTitle') }}
            </h4>
            <p class="text-xs text-brand-mocha/70 mt-0.5">
              {{ t('staffAuditLogSubtitle') }}
            </p>
          </div>

          <div class="rounded-xl border border-brand-sand overflow-hidden bg-brand-paper shadow-warm-sm">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead class="bg-brand-cream/80 text-brand-mocha border-b border-brand-sand font-bold">
                  <tr>
                    <th class="py-3 px-4">{{ t('staffAuditColTime') }}</th>
                    <th class="py-3 px-4">{{ t('staffAuditColStaff') }}</th>
                    <th class="py-3 px-4">{{ t('staffAuditColAction') }}</th>
                    <th class="py-3 px-4">{{ t('staffAuditColItem') }}</th>
                    <th class="py-3 px-4">{{ t('staffAuditColDetails') }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-brand-sand/60">
                  <tr v-for="log in auditLogs" :key="log.id" class="hover:bg-brand-cream/30 transition-colors">
                    <td class="py-3 px-4 font-mono text-[11px] text-brand-latte whitespace-nowrap">
                      {{ formatLogTime(log.timestamp) }}
                    </td>
                    <td class="py-3 px-4 font-bold text-brand-espresso whitespace-nowrap">
                      {{ log.staffName }}
                    </td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap" :class="log.statusBadgeClass || 'bg-brand-cream text-brand-mocha border-brand-sand'">
                        {{ isTh ? log.actionLabelTh : log.actionLabelEn }}
                      </span>
                    </td>
                    <td class="py-3 px-4 font-semibold text-brand-espresso">
                      <span class="text-brand-latte font-mono text-[10px] block">#{{ log.itemId }}</span>
                      <span class="line-clamp-1">{{ log.itemTitle }}</span>
                    </td>
                    <td class="py-3 px-4 text-brand-mocha/80 text-[11px] max-w-xs">
                      <p class="font-medium text-brand-espresso">{{ log.claimantInfo }}</p>
                      <p class="text-brand-latte line-clamp-2 mt-0.5">{{ log.notes }}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      <!-- Confirm Return Sub-modal Prompt -->
      <div v-if="returnConfirmItem" class="fixed inset-0 z-60 flex items-center justify-center p-4 bg-brand-espresso/50 backdrop-blur-xs">
        <div class="bg-brand-paper rounded-2xl p-5 border border-brand-sand max-w-md w-full shadow-warm-xl space-y-4">
          <h4 class="font-bold text-sm text-brand-espresso flex items-center gap-2">
            <ShieldCheck class="w-5 h-5 text-found" />
            <span>ยืนยันการส่งมอบคืนสิ่งของ (#{{ returnConfirmItem.id }})</span>
          </h4>
          <p class="text-xs text-brand-mocha">
            รายการ: <strong>{{ returnConfirmItem.titleTh }}</strong>
          </p>

          <div>
            <label class="block text-xs font-bold text-brand-espresso mb-1">
              ข้อมูลผู้รับมอบคืน (ชื่อ-นามสกุล / รหัสนักศึกษา)
            </label>
            <input 
              v-model="returnClaimant" 
              type="text" 
              placeholder="เช่น นายธนภัทร 6530xxx-x" 
              class="w-full px-3 py-2 rounded-xl bg-brand-cream/60 border border-brand-sand text-xs"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-brand-espresso mb-1">
              หมายเหตุ / หลักฐานที่ตรวจสอบ
            </label>
            <textarea 
              v-model="returnNotes" 
              rows="2" 
              placeholder="เช่น แสดงบัตรนักศึกษาตรงกับชื่อในกระเป๋า และปลดล็อกโทรศัพท์ได้ถูกต้อง"
              class="w-full px-3 py-2 rounded-xl bg-brand-cream/60 border border-brand-sand text-xs"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button 
              @click="returnConfirmItem = null" 
              class="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-brand-mocha hover:bg-brand-sand/40"
            >
              ยกเลิก
            </button>
            <button 
              @click="executeReturnConfirm" 
              class="px-4 py-2 rounded-lg bg-found hover:bg-found-dark text-white text-xs font-bold shadow-warm-sm"
            >
              บันทึกส่งคืนสำเร็จ & บันทึก Audit Log
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  X, ShieldCheck, Inbox, CheckSquare, FileText, 
  CheckCircle2 
} from 'lucide-vue-next'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  auditLogs: {
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

const emit = defineEmits(['close', 'approve-item', 'reject-item', 'confirm-return'])

const isTh = computed(() => props.currentLang === 'th')
const currentTab = ref('pending')

const pendingItems = computed(() => {
  return props.items.filter(i => i.status === 'pending_review')
})

const activeItems = computed(() => {
  return props.items.filter(i => i.status !== 'pending_review')
})

const returnConfirmItem = ref(null)
const returnClaimant = ref('')
const returnNotes = ref('')

function openConfirmReturnModal(item) {
  returnConfirmItem.value = item
  returnClaimant.value = ''
  returnNotes.value = 'ตรวจสอบหลักฐานยืนยันตัวตนเรียบร้อย ณ จุดส่งมอบทางการ'
}

function executeReturnConfirm() {
  if (!returnConfirmItem.value) return
  emit('confirm-return', {
    itemId: returnConfirmItem.value.id,
    itemTitle: returnConfirmItem.value.titleTh,
    claimant: returnClaimant.value || 'นิสิตผู้เป็นเจ้าของ',
    notes: returnNotes.value || 'ส่งมอบคืนเรียบร้อย'
  })
  returnConfirmItem.value = null
}

function handleApprove(item) {
  emit('approve-item', item.id)
}

function handleReject(item) {
  emit('reject-item', item.id)
}

function getStatusBadgeClass(status, type) {
  if (status === 'pending_review') return 'bg-amber-100 text-amber-900 border-amber-300'
  if (status === 'pending_confirm') return 'bg-purple-100 text-purple-900 border-purple-300'
  if (status === 'matched') return 'bg-blue-100 text-blue-900 border-blue-300'
  if (status === 'returned') return 'bg-returned-light text-returned-dark border-returned-border'
  if (status === 'closed') return 'bg-stone-200 text-stone-700 border-stone-300'
  if (type === 'lost') return 'bg-lost-light text-lost-dark border-lost-border'
  return 'bg-found-light text-found-dark border-found-border'
}

function getStatusLabel(status, type) {
  if (status === 'pending_review') return props.t('statusPendingReview')
  if (status === 'pending_confirm') return props.t('statusPendingConfirm')
  if (status === 'matched') return props.t('statusMatched')
  if (status === 'returned') return props.t('statusReturned')
  if (status === 'closed') return props.t('statusClosed')
  if (type === 'lost') return props.t('badgeLost')
  return props.t('badgeFound')
}

function formatLogTime(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  return d.toLocaleString('th-TH', { 
    month: 'short', day: 'numeric', 
    hour: '2-digit', minute: '2-digit' 
  })
}
</script>
