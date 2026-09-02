<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in zoom-in-95 duration-200">
    <!-- Backdrop Overlay -->
    <div 
      class="fixed inset-0 bg-brand-espresso/70 backdrop-blur-md transition-opacity" 
      @click="$emit('close')"
    ></div>

    <!-- Modal Dialog Panel -->
    <div 
      class="relative w-full max-w-3xl rounded-2xl bg-brand-paper shadow-warm-xl border-2 border-brand-caramel/40 overflow-hidden z-10 my-8 flex flex-col max-h-[92vh]"
    >
      <!-- Top Alert Header with Match Sparkle -->
      <div class="px-5 py-4 bg-gradient-to-r from-brand-cream/80 via-brand-paper to-brand-cream/80 border-b border-brand-sand flex items-center justify-between shrink-0 relative overflow-hidden">
        <!-- Subtle celebratory accent glow -->
        <div class="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-found/10 blur-xl pointer-events-none"></div>

        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-brand-chestnut flex items-center justify-center text-white shadow-warm-sm">
            <Sparkles class="w-4.5 h-4.5 text-brand-paper" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="font-bold text-base text-brand-espresso">
                {{ t('matchAlertTitle') }}
              </h2>
              <span class="px-2.5 py-0.5 rounded-md text-xs font-bold bg-match text-white shadow-warm-sm flex items-center gap-1">
                <Sparkles class="w-3 h-3 fill-current" />
                {{ matchData.totalScore }}% {{ t('matchScore') }}
              </span>
            </div>
            <p class="text-[11px] text-brand-mocha/80 mt-0.5">
              {{ t('matchAlertSubtitle') }}
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

      <!-- Modal Body: Side-by-Side Comparison -->
      <div class="p-6 overflow-y-auto space-y-6">
        
        <!-- Comparison Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <!-- Column 1: Newly Reported Item -->
          <div class="p-4 rounded-2xl bg-brand-cream/60 border border-brand-sand/80 flex flex-col justify-between space-y-3">
            <div>
              <span class="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-brand-sand text-brand-chestnut mb-2">
                {{ t('yourReportedItem') }} ({{ sourceItem.type === 'lost' ? t('badgeLost') : t('badgeFound') }})
              </span>
              <div class="w-full h-36 rounded-xl overflow-hidden bg-brand-sand/50 mb-3 border border-brand-tan/40">
                <img :src="sourceItem.imageUrl" alt="" class="w-full h-full object-cover" />
              </div>
              <h4 class="font-bold text-sm text-brand-espresso mb-1">
                {{ isTh ? sourceItem.titleTh : sourceItem.titleEn }}
              </h4>
              <p class="text-xs text-brand-mocha/70 line-clamp-2">
                {{ isTh ? sourceItem.descriptionTh : sourceItem.descriptionEn }}
              </p>
            </div>

            <div class="pt-2 border-t border-brand-sand text-xs text-brand-mocha/80 space-y-1">
              <div class="flex items-center gap-1">
                <MapPin class="w-3.5 h-3.5 text-brand-caramel shrink-0" />
                <span class="truncate">{{ isTh ? sourceItem.locationDetailTh : sourceItem.locationDetailEn }}</span>
              </div>
              <div class="flex items-center gap-1 text-[11px] text-brand-latte">
                <Calendar class="w-3 h-3" />
                <span>{{ sourceItem.date }}</span>
              </div>
            </div>
          </div>

          <!-- Column 2: Matched Candidate in Repository -->
          <div class="p-4 rounded-2xl bg-match-light/40 border-2 border-match-border flex flex-col justify-between space-y-3 relative">
            <span class="absolute -top-3 right-4 px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-match-dark text-white shadow-warm-sm">
              MATCH {{ matchData.totalScore }}%
            </span>

            <div>
              <span class="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-match-light text-match-dark mb-2">
                {{ t('matchedCandidateItem') }} ({{ candidateItem.type === 'lost' ? t('badgeLost') : t('badgeFound') }})
              </span>
              <div class="w-full h-36 rounded-xl overflow-hidden bg-brand-sand/50 mb-3 border border-match-border">
                <img :src="candidateItem.imageUrl" alt="" class="w-full h-full object-cover" />
              </div>
              <h4 class="font-bold text-sm text-brand-espresso mb-1">
                {{ isTh ? candidateItem.titleTh : candidateItem.titleEn }}
              </h4>
              <p class="text-xs text-brand-mocha/70 line-clamp-2">
                {{ isTh ? candidateItem.descriptionTh : candidateItem.descriptionEn }}
              </p>
            </div>

            <div class="pt-2 border-t border-match-border/60 text-xs text-brand-mocha/80 space-y-1">
              <div class="flex items-center gap-1">
                <MapPin class="w-3.5 h-3.5 text-match-dark shrink-0" />
                <span class="truncate font-semibold">{{ isTh ? candidateItem.locationDetailTh : candidateItem.locationDetailEn }}</span>
              </div>
              <div class="flex items-center gap-1 text-[11px] text-brand-latte">
                <Calendar class="w-3 h-3" />
                <span>{{ candidateItem.date }}</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Matching Reasons Breakdown -->
        <div class="p-4 rounded-2xl bg-brand-cream/80 border border-brand-sand space-y-2">
          <h4 class="text-xs font-bold text-brand-chestnut flex items-center gap-1.5">
            <CheckCircle class="w-4 h-4 text-found" />
            <span>{{ t('matchReasons') }}</span>
          </h4>
          <ul class="space-y-1.5 text-xs text-brand-espresso">
            <li 
              v-for="(reason, idx) in (isTh ? matchData.reasonsTh : matchData.reasonsEn)" 
              :key="idx"
              class="flex items-start gap-2"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-brand-caramel mt-1.5 shrink-0"></span>
              <span>{{ reason }}</span>
            </li>
          </ul>
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 bg-brand-cream/90 border-t border-brand-sand flex items-center justify-between shrink-0">
        <button 
          @click="$emit('close')"
          class="px-4 py-2 rounded-xl text-xs font-semibold text-brand-mocha hover:bg-brand-sand/60 transition-colors"
        >
          {{ t('btnIgnoreMatch') }}
        </button>

        <button 
          @click="$emit('verify-claim', candidateItem)"
          class="px-6 py-2.5 rounded-xl bg-brand-chestnut hover:bg-brand-mocha text-white text-xs font-bold shadow-warm-md transition-all flex items-center gap-2"
        >
          <span>{{ t('btnVerifyClaim') }}</span>
          <ArrowRight class="w-4 h-4" />
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Sparkles, X, MapPin, Calendar, CheckCircle, ArrowRight } from 'lucide-vue-next'

const props = defineProps({
  sourceItem: {
    type: Object,
    required: true
  },
  matchData: {
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

defineEmits(['close', 'verify-claim'])

const isTh = computed(() => props.currentLang === 'th')
const candidateItem = computed(() => props.matchData.candidate)
</script>
