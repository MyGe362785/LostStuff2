<template>
  <section id="handover-locations" class="scroll-mt-24 py-12 border-t border-brand-sand/70 bg-brand-cream/60">
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

      <!-- Campus map and interactive location preview -->
      <div class="mb-10 overflow-hidden rounded-2xl border border-brand-sand bg-brand-paper shadow-warm-md">
        <div class="grid lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)]">
          <div class="relative min-h-[330px] overflow-hidden bg-brand-sand/50 sm:min-h-[430px] lg:min-h-[500px]">
            <iframe
              class="absolute inset-0 h-full w-full border-0 pointer-events-none sm:hidden"
              src="https://www.google.com/maps/embed?origin=mfe&pb=!1m11!1m8!1m3!1d30607.677990312717!2d102.81611!3d16.47757!3m2!1i1024!2i768!4f13.1!5e0!6i14"
              :title="t('campusMapFrameTitle')"
              loading="lazy"
              allowfullscreen
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
            <iframe
              class="absolute inset-0 hidden h-full w-full border-0 pointer-events-none sm:block"
              src="https://www.google.com/maps/embed?origin=mfe&pb=!1m11!1m8!1m3!1d15303.838995156359!2d102.81611!3d16.47757!3m2!1i1024!2i768!4f13.1!5e0!6i15"
              :title="t('campusMapFrameTitle')"
              loading="lazy"
              allowfullscreen
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>

            <div class="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] rounded-xl bg-brand-paper/95 px-3.5 py-2.5 shadow-warm-md backdrop-blur-sm sm:left-4 sm:top-4">
              <p class="flex items-center gap-2 text-xs font-bold text-brand-espresso sm:text-sm">
                <MapPinned class="h-4 w-4 shrink-0 text-brand-caramel" aria-hidden="true" />
                {{ t('campusMapTitle') }}
              </p>
              <p class="mt-0.5 text-[10px] font-medium text-brand-mocha/75 sm:text-[11px]">
                {{ t('campusMapHint') }}
              </p>
            </div>

            <button
              v-for="location in handoverLocations"
              :key="`map-${location.id}`"
              type="button"
              class="map-pin group/pin absolute z-10 -translate-x-1/2 -translate-y-1/2 focus:outline-none"
              :style="pinStyle(location)"
              :aria-label="isTh ? `ดูรายละเอียด ${location.nameTh}` : `View details for ${location.nameEn}`"
              :aria-pressed="activeLocationId === location.id"
              @mouseenter="activeLocationId = location.id"
              @focus="activeLocationId = location.id"
              @click="activeLocationId = location.id"
            >
              <span
                class="flex h-9 w-9 items-center justify-center rounded-full text-brand-paper shadow-[0_5px_14px_rgba(45,32,22,0.28)] transition-[transform,background-color,box-shadow] duration-200 ease-out group-hover/pin:-translate-y-1 group-focus-visible/pin:-translate-y-1 group-focus-visible/pin:ring-4 group-focus-visible/pin:ring-brand-paper/90 motion-reduce:transform-none sm:h-10 sm:w-10"
                :class="activeLocationId === location.id ? 'scale-110 bg-brand-mocha ring-4 ring-brand-paper/90' : 'bg-brand-chestnut hover:bg-brand-mocha'"
              >
                <MapPin class="h-5 w-5" aria-hidden="true" />
              </span>
              <span
                class="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 rounded-md bg-brand-paper px-2 py-0.5 text-[10px] font-black text-brand-chestnut shadow-warm-sm transition-opacity"
                :class="activeLocationId === location.id ? 'opacity-100' : 'opacity-0 group-hover/pin:opacity-100 group-focus-visible/pin:opacity-100'"
                aria-hidden="true"
              >
                {{ location.code }}
              </span>
            </button>
          </div>

          <aside class="flex min-h-[430px] flex-col bg-brand-paper lg:min-h-[500px]" aria-live="polite">
            <Transition name="handover-detail" mode="out-in">
              <article :key="activeLocation.id" class="flex h-full flex-1 flex-col">
                <div class="relative aspect-[16/8] overflow-hidden bg-brand-sand/40 lg:aspect-[16/9]">
                  <img
                    :src="activeLocation.image"
                    :alt="isTh ? `ภาพ${activeLocation.nameTh}` : `Photo of ${activeLocation.nameEn}`"
                    class="h-full w-full object-cover"
                  />
                  <span class="absolute bottom-3 left-3 rounded-lg bg-brand-paper/95 px-2.5 py-1 text-[10px] font-black text-brand-chestnut shadow-warm-sm">
                    {{ activeLocation.code }}
                  </span>
                </div>

                <div class="flex flex-1 flex-col p-5 sm:p-6">
                  <p class="text-[11px] font-bold text-brand-latte">{{ activeLocation.zone }}</p>
                  <h3 class="mt-1 text-lg font-extrabold leading-snug text-brand-espresso sm:text-xl">
                    {{ isTh ? activeLocation.nameTh : activeLocation.nameEn }}
                  </h3>

                  <div class="mt-4 rounded-xl bg-brand-cream/80 p-4">
                    <p class="flex items-center gap-2 text-xs font-bold text-brand-chestnut">
                      <MapPin class="h-4 w-4 shrink-0 text-brand-caramel" aria-hidden="true" />
                      {{ isTh ? 'จุดฝากของ:' : 'Drop-off Desk:' }}
                    </p>
                    <p class="mt-1 pl-6 text-sm font-semibold text-brand-espresso">
                      {{ isTh ? activeLocation.handoverPointTh : activeLocation.handoverPointEn }}
                    </p>
                  </div>

                  <div class="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
                    <span class="flex items-center gap-1.5 text-xs font-medium text-brand-mocha/75">
                      <Clock class="h-4 w-4 text-brand-latte" aria-hidden="true" />
                      {{ isTh ? activeLocation.operatingHoursTh : activeLocation.operatingHoursEn }}
                    </span>
                    <span class="flex items-center gap-1 rounded-full bg-found-light px-2.5 py-1 text-[10px] font-bold text-found-dark">
                      <CheckCircle2 class="h-3.5 w-3.5" aria-hidden="true" />
                      {{ isTh ? 'พร้อมรับฝาก' : 'Available' }}
                    </span>
                  </div>

                  <a
                    :href="activeLocation.mapUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-chestnut px-4 py-2.5 text-xs font-bold text-brand-paper shadow-warm-sm transition-colors hover:bg-brand-mocha focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-caramel focus-visible:ring-offset-2 focus-visible:ring-offset-brand-paper"
                  >
                    <Navigation class="h-4 w-4" aria-hidden="true" />
                    {{ t('campusMapOpen') }}
                    <ExternalLink class="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </article>
            </Transition>
          </aside>
        </div>
      </div>

      <!-- Campus Handover Cards Grid -->
      <h3 class="mb-4 text-lg font-bold text-brand-espresso sm:text-xl">
        {{ t('campusLocationsListTitle') }}
      </h3>
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
import { computed, ref } from 'vue'
import { ShieldCheck, MapPin, MapPinned, Clock, CheckCircle2, CircleX, Navigation, ExternalLink } from 'lucide-vue-next'
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
const activeLocationId = ref(handoverLocations[0].id)
const activeLocation = computed(() => (
  handoverLocations.find(location => location.id === activeLocationId.value) || handoverLocations[0]
))

function pinStyle(location) {
  // The mobile map uses a wider zoom. Nearby library/SC09 pins receive a
  // subtle visual nudge so both remain independently tappable.
  const mobileNudge = location.id === 'kku_library_office'
    ? { x: -10, y: -4 }
    : location.id === 'sc09_wittayawiphas'
      ? { x: 10, y: 4 }
      : { x: 0, y: 0 }

  return {
    '--map-x-mobile': `${location.mapOffsetX + mobileNudge.x}px`,
    '--map-y-mobile': `${location.mapOffsetY + mobileNudge.y}px`,
    '--map-x-desktop': `${location.mapOffsetX * 2}px`,
    '--map-y-desktop': `${location.mapOffsetY * 2}px`,
  }
}
</script>

<style scoped>
.map-pin {
  left: calc(50% + var(--map-x-mobile));
  top: calc(50% + var(--map-y-mobile));
}

@media (min-width: 640px) {
  .map-pin {
    left: calc(50% + var(--map-x-desktop));
    top: calc(50% + var(--map-y-desktop));
  }
}

.handover-detail-enter-active,
.handover-detail-leave-active {
  transition: opacity 180ms ease-out, transform 180ms ease-out;
}

.handover-detail-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.handover-detail-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .handover-detail-enter-active,
  .handover-detail-leave-active {
    transition: none;
  }
}
</style>
