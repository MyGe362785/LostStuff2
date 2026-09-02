<template>
  <section class="py-12 border-t border-brand-sand/60 bg-brand-cream/30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-2xl mx-auto mb-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-sand/60 text-brand-chestnut text-xs font-bold mb-3 uppercase tracking-wider">
          <ShieldCheck class="w-4 h-4 text-found" />
          <span>{{ isTh ? 'จุดส่งมอบทางการ' : 'Verified Drop-off Zones' }}</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-brand-espresso mb-2">
          {{ t('campusDirectoryTitle') }}
        </h2>
        <p class="text-xs sm:text-sm text-brand-mocha/70">
          {{ t('campusDirectorySubtitle') }}
        </p>
      </div>

      <!-- Campus Handover Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        <div 
          v-for="bld in campusBuildings" 
          :key="bld.id"
          class="p-4 rounded-xl bg-brand-paper border border-brand-sand shadow-warm-sm hover:shadow-warm-md hover:border-brand-caramel/40 transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="px-2 py-0.5 rounded-md text-[10px] font-black bg-brand-cream text-brand-chestnut border border-brand-sand">
                {{ bld.code }}
              </span>
              <span class="text-[11px] font-semibold text-brand-latte">{{ bld.zone }}</span>
            </div>

            <h3 class="font-bold text-sm sm:text-base text-brand-espresso mb-1">
              {{ isTh ? bld.nameTh : bld.nameEn }}
            </h3>

            <div class="mt-2.5 p-2.5 rounded-lg bg-brand-cream/60 border border-brand-sand/60 space-y-1">
              <p class="text-[11px] font-bold text-brand-chestnut flex items-center gap-1.5">
                <MapPin class="w-3.5 h-3.5 text-brand-caramel shrink-0" />
                {{ isTh ? 'จุดฝากของ:' : 'Drop-off Desk:' }}
              </p>
              <p class="text-xs text-brand-espresso font-medium pl-5">
                {{ isTh ? bld.handoverPointTh : bld.handoverPointEn }}
              </p>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-brand-sand/50 flex items-center justify-between text-[11px] text-brand-mocha/70">
            <span class="flex items-center gap-1">
              <Clock class="w-3.5 h-3.5 text-brand-latte" />
              {{ bld.operatingHours }}
            </span>
            <span class="text-found font-bold text-[10px] flex items-center gap-1">
              <CheckCircle2 class="w-3 h-3" />
              {{ isTh ? 'พร้อมรับฝาก' : 'Active' }}
            </span>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { ShieldCheck, MapPin, Clock, CheckCircle2 } from 'lucide-vue-next'
import { campusBuildings } from '../data/campusLocations'

const props = defineProps({
  currentLang: {
    type: String,
    default: 'th'
  },
  t: {
    type: Function,
    required: true
  }
})

const isTh = computed(() => props.currentLang === 'th')
</script>
