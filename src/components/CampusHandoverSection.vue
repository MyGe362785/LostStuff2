<template>
  <section class="py-12 border-t border-brand-sand/70 bg-brand-cream/60">
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
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div 
          v-for="bld in handoverLocations"
          :key="bld.id"
          class="group flex flex-col overflow-hidden rounded-2xl border border-brand-sand bg-brand-paper shadow-warm-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-brand-caramel/50 hover:shadow-warm-md motion-reduce:transform-none motion-reduce:transition-none"
        >
          <div class="relative aspect-[16/8] overflow-hidden bg-brand-sand/40">
            <img
              :src="bld.image"
              :alt="isTh ? `ภาพ${bld.nameTh}` : `Photo of ${bld.nameEn}`"
              class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025] motion-reduce:transform-none motion-reduce:transition-none"
              loading="lazy"
            />
            <div class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-brand-espresso/45 to-transparent" aria-hidden="true"></div>
            <span class="absolute bottom-3 left-3 rounded-lg border border-white/50 bg-brand-paper/90 px-2.5 py-1 text-[10px] font-black text-brand-chestnut shadow-warm-sm backdrop-blur-sm">
              {{ bld.code }}
            </span>
          </div>

          <div class="flex flex-1 flex-col justify-between p-5">
            <div>
              <div class="mb-2 flex items-center justify-end gap-2">
                <span class="text-[11px] font-semibold text-brand-latte">{{ bld.zone }}</span>
              </div>

              <h3 class="mb-1 text-base font-bold text-brand-espresso sm:text-lg">
                {{ isTh ? bld.nameTh : bld.nameEn }}
              </h3>

              <div class="mt-3 space-y-1 rounded-xl border border-brand-sand/60 bg-brand-cream/60 p-3">
                <p class="flex items-center gap-1.5 text-[11px] font-bold text-brand-chestnut">
                  <MapPin class="h-3.5 w-3.5 shrink-0 text-brand-caramel" />
                  {{ isTh ? 'จุดฝากของ:' : 'Drop-off Desk:' }}
                </p>
                <p class="pl-5 text-sm font-medium text-brand-espresso">
                  {{ isTh ? bld.handoverPointTh : bld.handoverPointEn }}
                </p>
              </div>
            </div>

            <div class="mt-5 flex items-center justify-between border-t border-brand-sand/50 pt-3 text-[11px] text-brand-mocha/70">
              <span class="flex items-center gap-1.5">
                <Clock class="h-3.5 w-3.5 text-brand-latte" />
                {{ isTh ? bld.operatingHoursTh : bld.operatingHoursEn }}
              </span>
              <span
                class="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold"
                :class="bld.isAvailable ? 'bg-found-light text-found-dark' : 'bg-lost-light text-lost-dark'"
              >
                <component :is="bld.isAvailable ? CheckCircle2 : CircleX" class="h-3 w-3" />
                {{ bld.isAvailable ? (isTh ? 'พร้อมรับฝาก' : 'Available') : (isTh ? 'ไม่พร้อมรับฝาก' : 'Unavailable') }}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { ShieldCheck, MapPin, Clock, CheckCircle2, CircleX } from 'lucide-vue-next'
import { handoverLocations } from '../data/campusLocations'

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
