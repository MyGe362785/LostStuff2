<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-3 sm:p-6">
    <button
      class="fixed inset-0 cursor-default bg-brand-espresso/65 backdrop-blur-sm"
      type="button"
      :aria-label="t('modalClose')"
      @click="$emit('close')"
    ></button>

    <div class="relative z-10 my-4 w-full max-w-3xl">
      <button
        type="button"
        class="absolute left-2 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/90 bg-brand-chestnut text-white shadow-warm-xl transition-all hover:scale-105 hover:bg-brand-mocha disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:scale-100 sm:-left-16 sm:h-12 sm:w-12"
        :aria-label="t('quickFoundPrevious')"
        :disabled="currentIndex === 0"
        @click="$emit('previous')"
      >
        <ChevronLeft class="h-7 w-7" stroke-width="2.5" aria-hidden="true" />
      </button>

      <section
        ref="dialog"
        class="relative flex max-h-[94vh] w-full flex-col overflow-hidden rounded-2xl bg-brand-paper shadow-warm-xl"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
      >
      <header class="flex shrink-0 items-center justify-between gap-3 border-b border-brand-sand bg-brand-cream/80 px-4 py-3.5 sm:px-5">
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-found-light text-found-dark">
              <SearchCheck class="h-4 w-4" aria-hidden="true" />
            </span>
            <div class="min-w-0">
              <h2 :id="titleId" class="truncate text-sm font-extrabold text-brand-espresso sm:text-base">
                {{ t('quickFoundTitle') }}
              </h2>
              <p class="truncate text-[11px] font-medium text-brand-mocha/75">
                {{ resultSummary }}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-sand/70 text-brand-mocha transition-colors hover:bg-brand-sand hover:text-brand-espresso"
          :aria-label="t('modalClose')"
          @click="$emit('close')"
        >
          <X class="h-4 w-4" aria-hidden="true" />
        </button>
      </header>

      <div ref="scrollArea" class="overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
        <div class="mb-4 flex items-center justify-between gap-3">
          <span class="inline-flex items-center gap-1.5 rounded-md border border-found-border bg-found-light px-2.5 py-1 text-[11px] font-bold text-found-dark">
            <PackageCheck class="h-3.5 w-3.5" aria-hidden="true" />
            {{ t('quickFoundOnlyBadge') }}
          </span>
          <span class="text-xs font-bold tabular-nums text-brand-mocha" aria-live="polite">
            {{ currentIndex + 1 }} / {{ items.length }}
          </span>
        </div>

        <div class="h-56 w-full overflow-hidden rounded-xl bg-brand-cream sm:h-72">
          <img
            :src="item.imageUrl"
            :alt="isTh ? item.titleTh : item.titleEn"
            class="h-full w-full object-cover"
          />
        </div>

        <div class="py-5">
          <div class="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-brand-mocha/80">
            <span class="inline-flex items-center gap-1.5">
              <Calendar class="h-3.5 w-3.5 text-brand-caramel" aria-hidden="true" />
              {{ formatDate(item.date) }}
            </span>
            <span class="inline-flex items-center gap-1.5">
              <Clock class="h-3.5 w-3.5 text-brand-caramel" aria-hidden="true" />
              {{ isTh ? item.timeDetailTh : item.timeDetailEn }}
            </span>
          </div>
          <h3 class="text-xl font-extrabold leading-snug text-brand-espresso sm:text-2xl">
            {{ isTh ? item.titleTh : item.titleEn }}
          </h3>
        </div>

        <dl class="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          <div class="rounded-xl bg-brand-cream/70 p-3">
            <dt class="mb-1 text-[10px] font-bold text-brand-mocha/70">{{ t('badgeColor') }}</dt>
            <dd class="flex items-center gap-1.5 truncate text-xs font-bold text-brand-espresso">
              <span class="h-2.5 w-2.5 shrink-0 rounded-full border border-brand-tan" :style="{ backgroundColor: getColorHex(item.color || item.colorNameTh || item.colorNameEn) }"></span>
              {{ isTh ? (item.colorNameTh || item.color || '-') : (item.colorNameEn || item.color || '-') }}
            </dd>
          </div>
          <div class="rounded-xl bg-brand-cream/70 p-3">
            <dt class="mb-1 text-[10px] font-bold text-brand-mocha/70">{{ t('badgeBrand') }}</dt>
            <dd class="truncate text-xs font-bold text-brand-espresso">{{ item.brand || '-' }}</dd>
          </div>
          <div class="col-span-2 rounded-xl bg-brand-cream/70 p-3 sm:col-span-1">
            <dt class="mb-1 text-[10px] font-bold text-brand-mocha/70">{{ t('fieldCategory') }}</dt>
            <dd class="truncate text-xs font-bold text-brand-espresso">{{ categoryName }}</dd>
          </div>
        </dl>

        <div class="mt-4 space-y-3 text-sm">
          <div class="rounded-xl bg-brand-cream/55 p-4">
            <h4 class="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-brand-chestnut">
              <MapPin class="h-4 w-4 text-brand-caramel" aria-hidden="true" />
              {{ t('locationLabel') }}
            </h4>
            <p class="font-medium leading-relaxed text-brand-espresso">{{ isTh ? item.locationDetailTh : item.locationDetailEn }}</p>
          </div>

          <div v-if="item.distinctiveMarks" class="rounded-xl bg-brand-sand/45 p-4">
            <h4 class="mb-1.5 text-xs font-bold text-brand-chestnut">{{ t('badgeMarks') }}</h4>
            <p class="leading-relaxed text-brand-espresso">{{ item.distinctiveMarks }}</p>
          </div>

          <p class="leading-relaxed text-brand-espresso/90">{{ isTh ? item.descriptionTh : item.descriptionEn }}</p>

          <div class="rounded-xl bg-found-light/60 p-4 text-found-dark">
            <h4 class="mb-1 flex items-center gap-1.5 text-xs font-bold">
              <ShieldCheck class="h-4 w-4" aria-hidden="true" />
              {{ t('handoverLabel') }}
            </h4>
            <p class="text-xs font-medium leading-relaxed">{{ isTh ? item.handoverPointTh : item.handoverPointEn }}</p>
          </div>
        </div>
      </div>

      <footer class="shrink-0 border-t border-brand-sand bg-brand-cream/90 px-4 py-3.5 sm:px-6">
        <div class="flex justify-end">
          <button
            type="button"
            class="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-chestnut px-5 text-xs font-bold text-white shadow-warm-sm transition-colors hover:bg-brand-mocha sm:w-auto"
            @click="$emit('claim-item', item)"
          >
            <HandHeart class="h-4 w-4" aria-hidden="true" />
            {{ t('btnClaimItem') }}
          </button>
        </div>
      </footer>
      </section>

      <button
        type="button"
        class="absolute right-2 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/90 bg-brand-chestnut text-white shadow-warm-xl transition-all hover:scale-105 hover:bg-brand-mocha disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:scale-100 sm:-right-16 sm:h-12 sm:w-12"
        :aria-label="t('quickFoundNext')"
        :disabled="currentIndex === items.length - 1"
        @click="$emit('next')"
      >
        <ChevronRight class="h-7 w-7" stroke-width="2.5" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  Calendar, ChevronLeft, ChevronRight, Clock, HandHeart, MapPin,
  PackageCheck, SearchCheck, ShieldCheck, X,
} from 'lucide-vue-next'
import { itemCategories } from '../data/campusLocations'
import { getColorHex } from '../data/colors'

const props = defineProps({
  items: { type: Array, required: true },
  currentIndex: { type: Number, required: true },
  searchQuery: { type: String, default: '' },
  currentLang: { type: String, default: 'th' },
  t: { type: Function, required: true },
})

const emit = defineEmits(['close', 'previous', 'next', 'claim-item'])
const dialog = ref(null)
const scrollArea = ref(null)
const titleId = `quick-found-title-${Math.random().toString(36).slice(2, 8)}`

const isTh = computed(() => props.currentLang === 'th')
const item = computed(() => props.items[props.currentIndex])
const categoryName = computed(() => {
  const category = itemCategories.find(entry => entry.id === item.value.category)
  if (!category) return item.value.category
  return isTh.value ? category.nameTh : category.nameEn
})
const resultSummary = computed(() => {
  const count = props.items.length
  if (!props.searchQuery.trim()) {
    return isTh.value ? `พบของที่เก็บได้ ${count} รายการ` : `${count} found items available`
  }
  return isTh.value
    ? `พบ ${count} รายการที่ใกล้เคียงกับ “${props.searchQuery.trim()}”`
    : `${count} matches for “${props.searchQuery.trim()}”`
})

function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(isTh.value ? 'th-TH' : 'en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function handleKeydown(event) {
  if (event.key === 'Escape') emit('close')
  if (event.key === 'ArrowLeft' && props.currentIndex > 0) emit('previous')
  if (event.key === 'ArrowRight' && props.currentIndex < props.items.length - 1) emit('next')
}

watch(() => props.currentIndex, async () => {
  await nextTick()
  scrollArea.value?.scrollTo({ top: 0, behavior: 'smooth' })
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  dialog.value?.focus()
})

onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>
