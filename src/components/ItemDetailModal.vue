<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
    <!-- Backdrop Overlay -->
    <div 
      class="fixed inset-0 bg-brand-espresso/60 backdrop-blur-sm transition-opacity" 
      @click="$emit('close')"
    ></div>

    <!-- Modal Dialog Panel -->
    <div 
      class="relative w-full max-w-2xl rounded-2xl bg-brand-paper shadow-warm-xl border border-brand-sand overflow-hidden z-10 my-8 flex flex-col max-h-[90vh]"
    >
      <!-- Modal Header -->
      <div class="px-5 py-3.5 bg-brand-cream/80 border-b border-brand-sand/80 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-2.5">
          <span 
            class="px-2 py-0.5 rounded-md text-[11px] font-bold"
            :class="getStatusClass(item.status, item.type)"
          >
            {{ getStatusText(item.status, item.type) }}
          </span>
          <span class="text-xs font-semibold text-brand-latte">ID: #{{ item.id }}</span>
        </div>

        <button 
          @click="$emit('close')"
          class="w-7 h-7 rounded-lg bg-brand-sand/60 hover:bg-brand-sand text-brand-mocha flex items-center justify-center transition-colors"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Scrollable Body -->
      <div class="p-5 sm:p-6 overflow-y-auto space-y-5">
        
        <!-- Image Banner -->
        <div class="w-full h-64 sm:h-72 rounded-xl overflow-hidden bg-brand-cream border border-brand-sand relative">
          <img :src="item.imageUrl" alt="" class="w-full h-full object-cover" />
          <div class="absolute bottom-3 right-3">
            <span class="px-2.5 py-1 rounded-md text-xs font-bold bg-brand-paper/95 text-brand-chestnut border border-brand-sand shadow-warm-sm">
              {{ getCategoryName(item.category) }}
            </span>
          </div>
        </div>

        <!-- Title & Time -->
        <div>
          <h2 class="text-xl sm:text-2xl font-extrabold text-brand-espresso mb-2">
            {{ isTh ? item.titleTh : item.titleEn }}
          </h2>
          <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-brand-mocha/75">
            <span class="flex items-center gap-1.5 font-medium">
              <Calendar class="w-3.5 h-3.5 text-brand-caramel" />
              {{ formatDate(item.date) }} ({{ isTh ? item.timeDetailTh : item.timeDetailEn }})
            </span>
            <span class="flex items-center gap-1.5 font-medium">
              <Clock class="w-3.5 h-3.5 text-brand-caramel" />
              {{ formatTimeRange(item.timeRange) }}
            </span>
          </div>
        </div>

        <!-- Location Information -->
        <div class="p-4 rounded-2xl bg-brand-cream/60 border border-brand-sand/70 space-y-2">
          <div class="flex items-center gap-2 text-xs font-bold text-brand-chestnut">
            <MapPin class="w-4 h-4 text-brand-caramel" />
            <span>{{ t('locationLabel') }}</span>
          </div>
          <p class="text-sm font-semibold text-brand-espresso">
            {{ isTh ? item.locationDetailTh : item.locationDetailEn }}
          </p>
        </div>

        <!-- Detailed Description -->
        <div class="space-y-2">
          <h4 class="text-xs font-bold text-brand-mocha uppercase tracking-wider">
            {{ isTh ? 'รายละเอียดสิ่งของและจุดสังเกตเฉพาะ' : 'Item Description & Distinct Features' }}
          </h4>
          <p class="text-sm text-brand-espresso/90 leading-relaxed bg-brand-paper p-4 rounded-2xl border border-brand-sand/50">
            {{ isTh ? item.descriptionTh : item.descriptionEn }}
          </p>
        </div>

        <!-- Official Handover Drop-off Point Info -->
        <div class="p-4 rounded-2xl bg-brand-sand/30 border border-brand-tan/60 space-y-2">
          <div class="flex items-center gap-2 text-xs font-bold text-brand-chestnut">
            <ShieldCheck class="w-4 h-4 text-found" />
            <span>{{ t('handoverLabel') }}</span>
          </div>
          <p class="text-xs sm:text-sm text-brand-espresso font-medium">
            {{ isTh ? item.handoverPointTh : item.handoverPointEn }}
          </p>
        </div>

        <!-- Reporter & Contact Info -->
        <div class="p-4 rounded-2xl bg-brand-cream/40 border border-brand-sand/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span class="text-xs text-brand-latte font-medium">{{ isTh ? 'ผู้แจ้งข้อมูล:' : 'Reported by:' }}</span>
            <p class="text-xs font-bold text-brand-espresso">{{ item.reporterName }}</p>
          </div>
          <div class="text-left sm:text-right">
            <span class="text-xs text-brand-latte font-medium">{{ t('contactLabel') }}:</span>
            <p class="text-xs font-bold text-brand-chestnut font-mono">{{ item.reporterContact }}</p>
          </div>
        </div>

        <!-- Claim Instruction Notice -->
        <div v-if="item.status !== 'returned'" class="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1">
          <p class="font-bold flex items-center gap-1.5">
            <AlertCircle class="w-4 h-4 text-amber-600" />
            {{ isTh ? 'คำแนะนำในการขอรับสิ่งของคืน' : 'Ownership Claim Instructions' }}
          </p>
          <p class="text-amber-800 leading-relaxed">
            {{ isTh 
              ? 'กรุณาเตรียมหลักฐานยืนยัน เช่น บัตรนักศึกษา รหัสปลดล็อกหน้าจอ หรือสามารถระบุตำหนิที่ไม่ได้เปิดเผยในโพสต์ เพื่อความปลอดภัยในการส่งมอบ' 
              : 'Please prepare verification proof such as Student ID, device unlock passcode, or specific hidden details.' 
            }}
          </p>
        </div>

      </div>

      <!-- Modal Footer Action Buttons -->
      <div class="px-5 py-4 bg-brand-cream/90 border-t border-brand-sand/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
        
        <!-- Toggle Returned (if user is author) -->
        <button 
          v-if="item.status !== 'returned'"
          @click="$emit('mark-returned', item.id)"
          class="px-4 py-2 rounded-xl text-xs font-bold text-brand-mocha hover:text-brand-espresso hover:bg-brand-sand/60 transition-colors flex items-center gap-1.5"
        >
          <CheckCircle2 class="w-4 h-4 text-found" />
          <span>{{ t('btnMarkReturned') }}</span>
        </button>
        <div v-else class="text-xs font-bold text-found flex items-center gap-1.5">
          <CheckCircle2 class="w-4 h-4" />
          <span>{{ isTh ? 'ส่งมอบคืนสำเร็จแล้ว' : 'Successfully Reunited' }}</span>
        </div>

        <div class="flex items-center gap-2">
          <button 
            @click="$emit('close')"
            class="px-4 py-2 rounded-xl text-xs font-semibold text-brand-mocha hover:bg-brand-sand/50 transition-colors"
          >
            {{ t('modalClose') }}
          </button>
          
          <button 
            v-if="item.status !== 'returned'"
            @click="handleClaimClick"
            class="px-5 py-2.5 rounded-xl bg-brand-chestnut hover:bg-brand-mocha text-white text-xs font-bold shadow-warm-sm transition-all flex items-center gap-2"
          >
            <HandHeart class="w-4 h-4" />
            <span>{{ t('btnClaimItem') }}</span>
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
  X, Calendar, Clock, MapPin, ShieldCheck, 
  AlertCircle, CheckCircle2, HandHeart 
} from 'lucide-vue-next'
import { itemCategories } from '../data/campusLocations'

const props = defineProps({
  item: {
    type: Object,
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

const emit = defineEmits(['close', 'mark-returned', 'claim-item'])

const isTh = computed(() => props.currentLang === 'th')

function getStatusClass(status, type) {
  if (status === 'returned') return 'bg-returned-light text-returned-dark border border-returned-border'
  if (type === 'lost') return 'bg-lost-light text-lost-dark border border-lost-border'
  return 'bg-found-light text-found-dark border border-found-border'
}

function getStatusText(status, type) {
  if (status === 'returned') return props.t('badgeReturned')
  if (type === 'lost') return props.t('badgeLost')
  return props.t('badgeFound')
}

function getCategoryName(categoryId) {
  const found = itemCategories.find(c => c.id === categoryId)
  if (!found) return categoryId
  return isTh.value ? found.nameTh : found.nameEn
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return isTh.value 
    ? d.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })
    : d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatTimeRange(timeRange) {
  if (timeRange === 'morning') return props.t('fieldTimeMorning')
  if (timeRange === 'afternoon') return props.t('fieldTimeAfternoon')
  if (timeRange === 'evening') return props.t('fieldTimeEvening')
  return timeRange || '-'
}

function handleClaimClick() {
  emit('claim-item', props.item)
  emit('close')
}
</script>
