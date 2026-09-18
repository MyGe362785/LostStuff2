<template>
  <section class="relative pt-10 pb-16 border-b border-brand-sand/60 bg-gradient-to-b from-brand-cream/40 via-brand-cream/10 to-transparent">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
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
      <div class="max-w-2xl mx-auto mb-8">
        <div class="p-2 rounded-xl bg-brand-paper shadow-warm-md border border-brand-sand flex flex-col sm:flex-row gap-2 transition-all focus-within:border-brand-caramel focus-within:shadow-glow-caramel">
          <div class="flex-1 flex items-center px-3.5 gap-3">
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
          
          <button 
            @click="$emit('trigger-search')"
            class="px-6 py-3 rounded-lg bg-brand-chestnut hover:bg-brand-mocha text-white text-xs sm:text-sm font-bold transition-all shadow-warm-sm flex items-center justify-center gap-2 shrink-0"
          >
            <span>{{ t('btnSearch') }}</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
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
import { 
  Search, X, ArrowRight, AlertTriangle, PlusCircle
} from 'lucide-vue-next'

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

defineEmits(['update:searchQuery', 'trigger-search', 'open-report'])
</script>
