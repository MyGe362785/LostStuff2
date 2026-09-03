<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
    <!-- Backdrop Overlay -->
    <div 
      class="fixed inset-0 bg-brand-espresso/60 backdrop-blur-sm transition-opacity" 
      @click="$emit('close')"
    ></div>

    <!-- Modal Panel -->
    <div class="relative w-full max-w-xl rounded-2xl bg-brand-paper shadow-warm-xl border border-brand-sand overflow-hidden z-10 my-8 flex flex-col max-h-[90vh]">
      <!-- Header -->
      <div class="px-5 py-3.5 bg-brand-cream/80 border-b border-brand-sand/80 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-brand-chestnut flex items-center justify-center text-white">
            <HandHeart class="w-4 h-4" />
          </div>
          <div>
            <h3 class="font-bold text-sm sm:text-base text-brand-espresso">
              {{ t('claimModalTitle') }}
            </h3>
            <p class="text-[11px] text-brand-mocha/70">
              {{ t('claimModalSubtitle') }}
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

      <!-- Form Body -->
      <form @submit.prevent="handleSubmit" class="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
        
        <!-- Target Item Summary Banner -->
        <div class="p-3.5 rounded-xl bg-brand-cream/60 border border-brand-sand flex items-center gap-3">
          <img :src="item.imageUrl" alt="" class="w-14 h-14 rounded-lg object-cover border border-brand-sand shrink-0" />
          <div class="min-w-0 flex-1">
            <span class="text-[10px] text-brand-latte font-bold uppercase tracking-wider block">
              {{ t('claimItemSummary') }}
            </span>
            <h4 class="font-bold text-xs sm:text-sm text-brand-espresso truncate">
              {{ isTh ? item.titleTh : item.titleEn }}
            </h4>
            <p class="text-[11px] text-brand-mocha/70 truncate">
              ID: #{{ item.id }} • {{ isTh ? item.locationDetailTh : item.locationDetailEn }}
            </p>
          </div>
        </div>

        <!-- Hidden Distinction Details (ตำหนิลับที่ไม่เปิดเผย) -->
        <div>
          <label class="block text-xs font-bold text-brand-espresso mb-1">
            {{ t('claimSecretLabel') }} <span class="text-lost">*</span>
          </label>
          <textarea 
            v-model="secretDetails"
            rows="3"
            required
            :placeholder="t('claimSecretPlaceholder')"
            class="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-sand text-xs font-medium text-brand-espresso focus:outline-none focus:border-brand-caramel"
          ></textarea>
          <p class="text-[11px] text-brand-latte mt-1">
            {{ isTh ? '🔒 ข้อมูลนี้จะถูกส่งเฉพาะเจ้าหน้าที่ผู้ดูแล เพื่อป้องกันการแอบอ้างสิทธิ์' : '🔒 Kept confidential for official staff verification only' }}
          </p>
        </div>

        <!-- Student ID & Faculty / Claimant info -->
        <div>
          <label class="block text-xs font-bold text-brand-espresso mb-1">
            {{ t('claimProofStudentId') }} <span class="text-lost">*</span>
          </label>
          <input 
            v-model="claimantId"
            type="text"
            required
            :placeholder="t('claimProofStudentIdPlaceholder')"
            class="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-sand text-xs font-medium text-brand-espresso focus:outline-none focus:border-brand-caramel"
          />
        </div>

        <!-- Name & Contact -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-brand-espresso mb-1">
              {{ isTh ? 'ชื่อ-นามสกุล / ชื่อเล่น' : 'Full Name / Nickname' }} <span class="text-lost">*</span>
            </label>
            <input 
              v-model="claimantName"
              type="text"
              required
              :placeholder="isTh ? 'เช่น ธิดารัตน์' : 'e.g. John Doe'"
              class="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-sand text-xs font-medium text-brand-espresso focus:outline-none focus:border-brand-caramel"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-brand-espresso mb-1">
              {{ t('fieldContact') }} <span class="text-lost">*</span>
            </label>
            <input 
              v-model="claimantContact"
              type="text"
              required
              :placeholder="isTh ? 'LINE ID หรือ เบอร์โทร' : 'LINE ID or Phone'"
              class="w-full px-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-sand text-xs font-medium text-brand-espresso focus:outline-none focus:border-brand-caramel"
            />
          </div>
        </div>

        <!-- Supporting Proof / Receipt attachment simulation -->
        <div>
          <label class="block text-xs font-bold text-brand-espresso mb-1">
            {{ t('claimProofImage') }}
          </label>
          <div class="p-3 rounded-xl border border-dashed border-brand-sand bg-brand-cream/30 text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-brand-cream/60 transition-colors">
            <UploadCloud class="w-5 h-5 text-brand-chestnut" />
            <span class="text-xs font-semibold text-brand-espresso">
              {{ isTh ? 'แนบหลักฐานเพิ่มเติม (บัตรนักศึกษา / ใบเสร็จ / รูปถ่ายเดิม)' : 'Attach verification image (Student ID, receipt, photo)' }}
            </span>
            <span class="text-[10px] text-brand-latte">
              {{ isTh ? 'หรือนำหลักฐานตัวจริงมาแสดง ณ วันรับมอบของ' : 'Or present physical proof upon handover' }}
            </span>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="pt-3 border-t border-brand-sand/80 flex items-center justify-end gap-2.5">
          <button 
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 rounded-xl text-xs font-semibold text-brand-mocha hover:bg-brand-sand/50 transition-colors"
          >
            {{ t('modalClose') }}
          </button>

          <button 
            type="submit"
            class="px-5 py-2.5 rounded-xl bg-brand-chestnut hover:bg-brand-mocha text-white text-xs font-bold shadow-warm-sm transition-all flex items-center gap-2"
          >
            <ShieldCheck class="w-4 h-4" />
            <span>{{ t('btnSubmitClaim') }}</span>
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { X, HandHeart, ShieldCheck, UploadCloud } from 'lucide-vue-next'

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

const emit = defineEmits(['close', 'submit-claim'])

const isTh = computed(() => props.currentLang === 'th')

const secretDetails = ref('')
const claimantId = ref('')
const claimantName = ref('')
const claimantContact = ref('')

function handleSubmit() {
  if (!secretDetails.value.trim() || !claimantId.value.trim() || !claimantName.value.trim()) {
    alert(isTh.value ? 'กรุณากรอกข้อมูลให้ครบถ้วน' : 'Please complete all required fields')
    return
  }

  const claimData = {
    itemId: props.item.id,
    secretDetails: secretDetails.value,
    claimantId: claimantId.value,
    claimantName: claimantName.value,
    claimantContact: claimantContact.value,
    submittedAt: new Date().toISOString()
  }

  emit('submit-claim', claimData)
  emit('close')
}
</script>
