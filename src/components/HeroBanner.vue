<template>
  <section class="relative overflow-hidden border-b border-brand-sand/60 bg-gradient-to-b from-brand-cream/40 via-brand-cream/10 to-transparent pb-16 pt-10">
    <div class="pointer-events-none absolute inset-0 z-0 select-none" aria-hidden="true">
      <img
        v-for="item in heroItems"
        :key="item.name"
        :src="item.src"
        alt=""
        class="hero-pile-item"
        :class="[item.className, { 'hero-pile-item--drop': shouldAnimateItems }]"
        :style="item.style"
        draggable="false"
      />
    </div>

    <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      
      <!-- Top Modern Badge -->
      <div class="flex justify-center mb-5">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-md bg-brand-paper shadow-warm-sm border border-brand-sand text-[11px] font-bold text-brand-chestnut tracking-wide uppercase">
          <span class="w-2 h-2 rounded-full bg-found animate-pulse"></span>
          <span>{{ t('heroBadge') }}</span>
        </div>
      </div>

      <!-- High-Conviction Display Headline & Subtitle -->
      <div class="text-center max-w-4xl lg:max-w-5xl mx-auto mb-9">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-brand-espresso tracking-tight leading-[1.12] whitespace-pre-line">
          {{ t('heroHeading') }}
        </h1>
      </div>

      <!-- Bold Search Centerpiece -->
      <div class="max-w-4xl mx-auto mb-4">
        <div class="p-2 rounded-xl bg-brand-paper shadow-warm-md border border-brand-sand flex flex-col lg:flex-row gap-2 transition-all focus-within:border-brand-caramel focus-within:shadow-glow-caramel">
          <div class="flex-1 flex items-center px-3.5 gap-3 min-w-0">
            <Search class="w-4.5 h-4.5 text-brand-latte shrink-0" />
            <input 
              id="hero-search-input"
              :value="searchQuery"
              @input="$emit('update:searchQuery', $event.target.value)"
              @keydown.enter="$emit('trigger-search')"
              type="text" 
              :placeholder="t('heroSearchPlaceholder')"
              class="w-full bg-transparent text-xs sm:text-sm font-medium text-brand-espresso placeholder-brand-latte/80 focus:outline-none py-2"
            />
            <kbd class="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-cream text-brand-latte border border-brand-sand shrink-0">
              /
            </kbd>
            <button
              v-if="searchQuery" 
              @click="$emit('update:searchQuery', '')"
              class="text-brand-latte hover:text-brand-chestnut p-1"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
          
          <div class="grid grid-cols-2 gap-2 lg:flex lg:shrink-0">
            <button
              @click="$emit('trigger-search')"
              class="px-4 sm:px-6 py-3 rounded-lg bg-brand-chestnut hover:bg-brand-mocha text-white text-xs sm:text-sm font-bold transition-colors shadow-warm-sm flex items-center justify-center gap-2"
            >
              <span>{{ t('btnSearch') }}</span>
              <ArrowRight class="w-4 h-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              :disabled="!searchQuery.trim()"
              :title="!searchQuery.trim() ? t('quickFoundEnterName') : t('btnQuickFoundSearch')"
              @click="$emit('quick-find')"
              class="px-3 sm:px-4 py-3 rounded-lg bg-found-light hover:bg-green-100 text-found-dark text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:bg-brand-cream disabled:text-brand-latte disabled:opacity-75"
            >
              <SearchCheck class="w-4 h-4 shrink-0" aria-hidden="true" />
              <span class="leading-tight">{{ t('btnQuickFoundSearch') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Popular Search Tags -->
      <div class="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-8 text-[11px] font-medium text-brand-mocha/70">
        <button 
          v-for="tag in popularTags" 
          :key="tag"
          @click="selectQuickTag(tag)"
          class="px-2.5 py-1 rounded-md bg-brand-cream/70 hover:bg-brand-sand/80 hover:text-brand-espresso text-brand-mocha border border-brand-sand/60 transition-colors"
        >
          {{ tag }}
        </button>
      </div>

      <!-- Primary Report Actions -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
        <button 
          @click="$emit('open-report', 'lost')"
          class="group min-h-14 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-lost-light hover:bg-amber-100 text-lost-dark border border-lost-border font-extrabold text-sm shadow-warm-md hover:shadow-warm-lg hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lost focus-visible:ring-offset-2 focus-visible:ring-offset-brand-paper"
        >
          <span class="w-8 h-8 rounded-lg bg-lost/10 flex items-center justify-center shrink-0 transition-colors group-hover:bg-lost/15">
            <AlertTriangle class="w-4.5 h-4.5" />
          </span>
          <span>{{ t('btnReportLostMain') }}</span>
        </button>

        <button 
          @click="$emit('open-report', 'found')"
          class="group min-h-14 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-brand-chestnut hover:bg-brand-mocha text-white font-extrabold text-sm shadow-warm-md hover:shadow-warm-lg hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-caramel focus-visible:ring-offset-2 focus-visible:ring-offset-brand-paper"
        >
          <span class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 transition-colors group-hover:bg-white/15">
            <PlusCircle class="w-4.5 h-4.5" />
          </span>
          <span>{{ t('btnReportFoundMain') }}</span>
        </button>
      </div>

    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { 
  Search, SearchCheck, X, ArrowRight, AlertTriangle, PlusCircle
} from 'lucide-vue-next'
import backpackImage from '../../img/article1.png'
import pencilImage from '../../img/article2.png'
import tabletImage from '../../img/article3.png'
import airpodsImage from '../../img/article5.png'
import carKeyImage from '../../img/article6.png'

let hasPlayedHeroItemDrop = false

const shouldAnimateItems = ref(false)
const heroItems = [
  {
    name: 'backpack',
    src: backpackImage,
    className: 'bottom-[-5.5rem] left-[-4.5rem] w-36 sm:bottom-[-7rem] sm:left-[-4rem] sm:w-52 lg:left-[-2rem] lg:w-60 xl:left-[1%] xl:w-64',
    style: { '--settle-rotation': '-7deg', '--start-rotation': '-24deg', '--drop-delay': '40ms' },
  },
  {
    name: 'pencil',
    src: pencilImage,
    className: 'hero-pile-item--pencil left-[-6rem] top-12 w-60 mix-blend-multiply sm:left-[-5rem] sm:top-14 sm:w-72 lg:left-[-4rem] lg:top-12 lg:w-96',
    style: { '--settle-rotation': '-16deg', '--start-rotation': '8deg', '--drop-delay': '120ms' },
  },
  {
    name: 'tablet',
    src: tabletImage,
    className: 'right-[-5rem] top-24 w-40 mix-blend-multiply sm:right-[-6rem] sm:top-20 sm:w-56 lg:right-[-3rem] lg:top-24 lg:w-64 xl:right-[1%] xl:w-72',
    style: { '--settle-rotation': '7deg', '--start-rotation': '28deg', '--drop-delay': '200ms' },
  },
  {
    name: 'airpods',
    src: airpodsImage,
    className: 'bottom-20 right-[-1.5rem] w-20 sm:bottom-20 sm:right-[4%] sm:w-24 lg:bottom-16 lg:right-[8%] lg:w-28',
    style: { '--settle-rotation': '11deg', '--start-rotation': '-12deg', '--drop-delay': '280ms' },
  },
  {
    name: 'car-key',
    src: carKeyImage,
    className: 'bottom-[-1.5rem] left-[17%] w-20 sm:bottom-[-2rem] sm:left-[19%] sm:w-28 lg:left-[14%] lg:w-32',
    style: { '--settle-rotation': '-13deg', '--start-rotation': '16deg', '--drop-delay': '360ms' },
  },
]

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  },
  activeLostCount: {
    type: Number,
    default: 18
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

const emit = defineEmits(['update:searchQuery', 'trigger-search', 'quick-find', 'open-report'])

const isTh = computed(() => props.currentLang === 'th')

onMounted(() => {
  if (hasPlayedHeroItemDrop) return
  shouldAnimateItems.value = true
  hasPlayedHeroItemDrop = true
})

const popularTags = computed(() => {
  return isTh.value 
    ? ['AirPods', 'บัตรนักศึกษา', 'กุญแจรถ', 'กระเป๋าสตางค์', 'iPad'] 
    : ['AirPods', 'Student ID', 'Car Keys', 'Wallet', 'iPad']
})

function selectQuickTag(tag) {
  emit('update:searchQuery', tag)
  emit('trigger-search')
}
</script>

<style scoped>
.hero-pile-item {
  position: absolute;
  opacity: 0.86;
  transform: rotate(var(--settle-rotation));
  transform-origin: center;
  filter: drop-shadow(0 14px 18px rgb(45 32 22 / 0.14));
}

.hero-pile-item--drop {
  animation: hero-item-drop 820ms cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: var(--drop-delay);
}

.hero-pile-item--pencil {
  clip-path: inset(0 45% 0 45%);
  filter: none;
}

@keyframes hero-item-drop {
  0% {
    opacity: 0;
    transform: translate3d(0, -72vh, 0) rotate(var(--start-rotation)) scale(0.92);
  }
  72% {
    opacity: 0.9;
    transform: translate3d(0, 10px, 0) rotate(var(--settle-rotation)) scale(1);
  }
  88% {
    opacity: 0.86;
    transform: translate3d(0, -3px, 0) rotate(var(--settle-rotation)) scale(1);
  }
  100% {
    opacity: 0.86;
    transform: translate3d(0, 0, 0) rotate(var(--settle-rotation)) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-pile-item--drop {
    animation: hero-item-fade 180ms ease-out both;
  }

  @keyframes hero-item-fade {
    from { opacity: 0; }
    to { opacity: 0.86; }
  }
}
</style>
