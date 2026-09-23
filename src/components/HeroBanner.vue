<template>
  <section class="relative overflow-hidden border-b border-brand-sand/60 bg-gradient-to-b from-brand-cream/45 via-brand-cream/15 to-transparent">
    <div class="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 sm:pb-14 sm:pt-12 lg:px-8 lg:pb-16 lg:pt-14">
      <div class="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
        <div class="relative z-10 max-w-2xl">
          <h1 class="whitespace-pre-line text-balance text-left text-4xl font-black leading-[1.08] tracking-[-0.03em] text-brand-espresso sm:text-5xl xl:text-6xl">
            <template v-if="isTh">
              <span>{{ t('heroHeadingLead') }}</span>
              <span class="block text-brand-caramel">{{ t('heroHeadingAccent') }}</span>
            </template>
            <template v-else>
              <span class="block text-brand-caramel">{{ t('heroHeadingAccent') }}</span>
              <span>{{ t('heroHeadingTail') }}</span>
            </template>
          </h1>
          <p class="mt-5 max-w-xl text-base font-medium leading-7 text-brand-mocha/80 sm:text-lg">
            {{ t('heroSlogan') }}
          </p>
        </div>

        <div
          class="hero-art relative min-h-[260px] select-none sm:min-h-[320px] lg:min-h-[360px]"
          :class="{ 'hero-art--enter': shouldAnimateArt }"
          aria-hidden="true"
        >
          <img :src="pencilImage" alt="" class="hero-art__pencil" draggable="false" />
          <img :src="backpackImage" alt="" class="hero-art__backpack" draggable="false" />
          <img :src="tabletImage" alt="" class="hero-art__tablet" draggable="false" />
          <img :src="airpodsImage" alt="" class="hero-art__airpods" draggable="false" />
          <img :src="carKeyImage" alt="" class="hero-art__car-key" draggable="false" />
          <img :src="guideCharacter" alt="" class="hero-art__character" draggable="false" />
        </div>
      </div>

      <div class="relative z-20 mt-8 sm:mt-10 lg:mt-12">
        <div data-tour="search" class="mx-auto max-w-5xl">
          <div class="flex flex-col gap-2 rounded-xl border border-brand-sand bg-brand-paper p-2 shadow-warm-md transition-all focus-within:border-brand-caramel focus-within:shadow-glow-caramel lg:flex-row">
            <div class="flex min-w-0 flex-1 items-center gap-3 px-3.5">
              <Search class="h-5 w-5 shrink-0 text-brand-latte" aria-hidden="true" />
              <label for="hero-search-input" class="sr-only">{{ t('heroSearchPlaceholder') }}</label>
              <input
                id="hero-search-input"
                :value="searchQuery"
                type="search"
                :placeholder="t('heroSearchPlaceholder')"
                class="w-full bg-transparent py-2.5 text-xs font-medium text-brand-espresso placeholder-brand-latte/80 focus:outline-none sm:text-sm"
                @input="$emit('update:searchQuery', $event.target.value)"
                @keydown.enter="$emit('trigger-search')"
              />
              <kbd class="hidden shrink-0 rounded border border-brand-sand bg-brand-cream px-2 py-0.5 font-mono text-[10px] font-bold text-brand-latte sm:inline-flex">/</kbd>
              <button
                v-if="searchQuery"
                type="button"
                :aria-label="t('clearSearch')"
                class="rounded p-1 text-brand-latte transition-colors hover:text-brand-chestnut focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-caramel"
                @click="$emit('update:searchQuery', '')"
              >
                <X class="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div class="grid grid-cols-2 gap-2 lg:flex lg:shrink-0">
              <button
                type="button"
                class="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-chestnut px-5 py-3 text-xs font-bold text-white shadow-warm-sm transition-colors hover:bg-brand-mocha focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-caramel focus-visible:ring-offset-2 sm:px-7 sm:text-sm"
                @click="$emit('trigger-search')"
              >
                <span>{{ t('btnSearch') }}</span>
                <ArrowRight class="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                :disabled="!searchQuery.trim()"
                :title="!searchQuery.trim() ? t('quickFoundEnterName') : t('btnQuickFoundSearch')"
                class="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-found-light px-4 py-3 text-xs font-bold text-found-dark transition-colors hover:bg-green-100 disabled:cursor-not-allowed disabled:bg-brand-cream disabled:text-brand-latte disabled:opacity-75 sm:text-sm"
                @click="$emit('quick-find')"
              >
                <SearchCheck class="h-4 w-4 shrink-0" aria-hidden="true" />
                <span class="leading-tight">{{ t('btnQuickFoundSearch') }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium text-brand-mocha/70">
          <button
            v-for="tag in popularTags"
            :key="tag"
            type="button"
            class="rounded-md border border-brand-sand/70 bg-brand-paper/85 px-3 py-1.5 text-brand-mocha transition-colors hover:border-brand-caramel hover:bg-brand-cream hover:text-brand-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-caramel"
            @click="selectQuickTag(tag)"
          >
            {{ tag }}
          </button>
        </div>

        <div class="mx-auto mt-7 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            data-tour="report-lost"
            type="button"
            class="group flex min-h-16 items-center justify-center gap-3 rounded-xl border border-lost-border bg-lost-light px-6 py-4 text-sm font-extrabold text-lost-dark shadow-warm-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-100 hover:shadow-warm-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lost focus-visible:ring-offset-2 focus-visible:ring-offset-brand-paper"
            @click="$emit('open-report', 'lost')"
          >
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lost/10 transition-colors group-hover:bg-lost/15">
              <AlertTriangle class="h-5 w-5" aria-hidden="true" />
            </span>
            <span>{{ t('btnReportLostMain') }}</span>
          </button>
          <button
            data-tour="report-found"
            type="button"
            class="group flex min-h-16 items-center justify-center gap-3 rounded-xl bg-brand-chestnut px-6 py-4 text-sm font-extrabold text-white shadow-warm-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-mocha hover:shadow-warm-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-caramel focus-visible:ring-offset-2 focus-visible:ring-offset-brand-paper"
            @click="$emit('open-report', 'found')"
          >
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 transition-colors group-hover:bg-white/15">
              <PlusCircle class="h-5 w-5" aria-hidden="true" />
            </span>
            <span>{{ t('btnReportFoundMain') }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { AlertTriangle, ArrowRight, PlusCircle, Search, SearchCheck, X } from 'lucide-vue-next'
import backpackImage from '../../img/article1.webp'
import pencilImage from '../../img/article2.webp'
import tabletImage from '../../img/article3.webp'
import airpodsImage from '../../img/article5.webp'
import carKeyImage from '../../img/article6.webp'
import guideCharacter from '../../img/ghibli4-hero.webp'

let hasPlayedHeroArtReveal = false

const props = defineProps({
  searchQuery: { type: String, default: '' },
  activeLostCount: { type: Number, default: 18 },
  currentLang: { type: String, default: 'th' },
  t: { type: Function, required: true },
})

const emit = defineEmits(['update:searchQuery', 'trigger-search', 'quick-find', 'open-report'])
const isTh = computed(() => props.currentLang === 'th')
const shouldAnimateArt = ref(false)
const popularTags = computed(() => isTh.value
  ? ['AirPods', 'บัตรนักศึกษา', 'กุญแจรถ', 'กระเป๋าสตางค์', 'iPad']
  : ['AirPods', 'Student ID', 'Car Keys', 'Wallet', 'iPad'])

onMounted(() => {
  if (hasPlayedHeroArtReveal) return
  shouldAnimateArt.value = true
  hasPlayedHeroArtReveal = true
})

function selectQuickTag(tag) {
  emit('update:searchQuery', tag)
  emit('trigger-search')
}
</script>

<style scoped>
.hero-art img {
  position: absolute;
  pointer-events: none;
  user-select: none;
}

.hero-art__pencil {
  left: 0;
  top: 3%;
  width: 58%;
  clip-path: inset(0 45% 0 45%);
  rotate: -17deg;
  mix-blend-mode: multiply;
}

.hero-art__backpack {
  bottom: 0;
  left: 0;
  width: 36%;
  rotate: -7deg;
  filter: drop-shadow(0 18px 22px rgb(45 32 22 / 0.16));
}

.hero-art__tablet {
  right: -3%;
  top: 5%;
  width: 53%;
  rotate: 7deg;
  mix-blend-mode: multiply;
  filter: drop-shadow(0 18px 22px rgb(45 32 22 / 0.12));
}

.hero-art__airpods {
  right: 7%;
  bottom: 3%;
  width: 20%;
  rotate: 9deg;
  filter: drop-shadow(0 12px 16px rgb(45 32 22 / 0.13));
}

.hero-art__car-key {
  bottom: 0;
  left: 31%;
  width: 22%;
  rotate: -11deg;
  filter: drop-shadow(0 12px 16px rgb(45 32 22 / 0.15));
}

.hero-art__character {
  bottom: 0;
  left: 38%;
  z-index: 2;
  width: 24%;
  mask-image: linear-gradient(to bottom, #000 78%, transparent 100%);
  filter: drop-shadow(0 18px 24px rgb(45 32 22 / 0.2));
}

.hero-art--enter {
  animation: hero-art-reveal 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes hero-art-reveal {
  from {
    opacity: 0;
    transform: translate3d(24px, 18px, 0) scale(0.98);
    filter: blur(8px);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
    filter: blur(0);
  }
}

@media (max-width: 639px) {
  .hero-art__pencil { left: -7%; width: 72%; }
  .hero-art__backpack { width: 39%; }
  .hero-art__tablet { right: -10%; width: 58%; }
  .hero-art__airpods { right: 4%; width: 22%; }
  .hero-art__car-key { left: 26%; width: 25%; }
  .hero-art__character { left: 39%; width: 28%; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-art--enter { animation: none; }
}
</style>
