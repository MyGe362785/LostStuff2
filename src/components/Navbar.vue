<template>
  <header class="sticky top-0 z-40 bg-brand-paper/95 backdrop-blur-md border-b border-brand-sand/70 transition-all">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-14 sm:h-16">
        
        <!-- Brand Logo & Campus Tag -->
        <div class="flex cursor-pointer items-center gap-2.5 transition-transform duration-150 active:scale-[0.98] motion-reduce:transition-none" @click="$emit('nav-change', 'home')">
          <div class="w-8 h-8 rounded-lg bg-brand-chestnut flex items-center justify-center text-white shadow-warm-sm">
            <Compass class="w-4.5 h-4.5 text-brand-paper" />
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-base tracking-tight text-brand-espresso whitespace-nowrap">Foundit<span class="text-brand-caramel">-KKU</span></span>
            </div>
            <span class="hidden sm:block text-[10px] text-brand-latte -mt-0.5 tracking-wider">
              University Lost & Found
            </span>
          </div>
        </div>

        <!-- Student Public Navigation Links -->
        <nav class="hidden md:flex items-center gap-6 text-xs font-semibold">
          <button 
            @click="$emit('nav-change', 'home')"
            class="relative py-1 transition-[color,transform] duration-200 active:scale-95 motion-reduce:transition-none"
            :class="activeTab === 'home' ? 'font-bold text-brand-chestnut' : 'text-brand-mocha/70 hover:text-brand-espresso'"
            :aria-current="activeTab === 'home' ? 'page' : undefined"
          >
            {{ t('navHome') }}
            <span class="absolute -bottom-1 left-0 h-0.5 w-full origin-center rounded-full bg-brand-chestnut transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none" :class="activeTab === 'home' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'" aria-hidden="true"></span>
          </button>
          
          <button 
            @click="$emit('nav-change', 'search')"
            class="relative py-1 transition-[color,transform] duration-200 active:scale-95 motion-reduce:transition-none"
            :class="activeTab === 'search' ? 'font-bold text-brand-chestnut' : 'text-brand-mocha/70 hover:text-brand-espresso'"
            :aria-current="activeTab === 'search' ? 'page' : undefined"
          >
            {{ t('navSearch') }}
            <span class="absolute -bottom-1 left-0 h-0.5 w-full origin-center rounded-full bg-brand-chestnut transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none" :class="activeTab === 'search' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'" aria-hidden="true"></span>
          </button>
          
          <button 
            @click="$emit('nav-change', 'my-posts')"
            class="relative flex items-center gap-1.5 py-1 transition-[color,transform] duration-200 active:scale-95 motion-reduce:transition-none"
            :class="activeTab === 'my-posts' ? 'font-bold text-brand-chestnut' : 'text-brand-mocha/70 hover:text-brand-espresso'"
            :aria-current="activeTab === 'my-posts' ? 'page' : undefined"
          >
            {{ t('navMyReports') }}
            <span v-if="myReportsCount > 0" class="px-1.5 py-0.2 rounded-full text-[10px] bg-brand-cream text-brand-chestnut font-bold border border-brand-sand">
              {{ myReportsCount }}
            </span>
            <span class="absolute -bottom-1 left-0 h-0.5 w-full origin-center rounded-full bg-brand-chestnut transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none" :class="activeTab === 'my-posts' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'" aria-hidden="true"></span>
          </button>

          <button 
            @click="$emit('nav-change', 'locations')"
            class="relative py-1 transition-[color,transform] duration-200 active:scale-95 motion-reduce:transition-none"
            :class="activeTab === 'locations' ? 'font-bold text-brand-chestnut' : 'text-brand-mocha/70 hover:text-brand-espresso'"
            :aria-current="activeTab === 'locations' ? 'page' : undefined"
          >
            {{ t('navLocations') }}
            <span class="absolute -bottom-1 left-0 h-0.5 w-full origin-center rounded-full bg-brand-chestnut transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none" :class="activeTab === 'locations' ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'" aria-hidden="true"></span>
          </button>
        </nav>

        <!-- Right Action Cluster -->
        <div class="flex items-center gap-2 sm:gap-2.5">
          
          <!-- Simulated email inbox: demo mode only, it is not wired to real notifications -->
          <button
            v-if="!backendConfigured"
            @click="$emit('open-emails')"
            class="hidden min-[360px]:flex w-10 h-10 rounded-xl hover:bg-brand-cream/80 text-brand-mocha transition-all items-center justify-center relative border border-transparent hover:border-brand-sand"
            :title="isTh ? 'การแจ้งเตือนทางอีเมล (Email Notifications)' : 'Email Notifications'"
          >
            <Mail class="w-5 h-5 text-brand-espresso" />
            <span 
              v-if="emailsCount > 0"
              class="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-lost text-white text-[11px] font-extrabold flex items-center justify-center shadow-warm-md border-2 border-brand-paper leading-none animate-pulse"
            >
              {{ emailsCount }}
            </span>
          </button>

          <!-- Satisfaction survey: shown on layouts with enough room for a hover tooltip -->
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSddiVTqyNb43VTCXMhvNs1TPwov3W4_fo0FvGk9yWkW1YwR2Q/viewform"
            target="_blank"
            rel="noopener noreferrer"
            class="group relative hidden lg:inline-flex w-10 h-10 items-center justify-center rounded-xl border border-transparent text-brand-mocha transition-all hover:border-brand-sand hover:bg-brand-cream/80 hover:text-brand-chestnut focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-caramel focus-visible:ring-offset-2 focus-visible:ring-offset-brand-paper"
            :aria-label="t('navSatisfactionSurvey')"
            aria-describedby="navbar-survey-tooltip"
            :title="t('navSatisfactionSurvey')"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M8 4h8" />
              <path d="M9 2h6a1 1 0 0 1 1 1v2H8V3a1 1 0 0 1 1-1Z" />
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <path d="m8 13 2.25 2.25L16 9.5" />
            </svg>
            <span
              id="navbar-survey-tooltip"
              role="tooltip"
              class="pointer-events-none invisible absolute right-0 top-full z-50 mt-2 translate-y-1 whitespace-nowrap rounded-lg bg-brand-espresso px-3 py-2 text-[11px] font-semibold text-brand-paper opacity-0 shadow-warm-lg transition duration-150 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:visible group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transform-none motion-reduce:transition-none"
            >
              {{ t('navSatisfactionSurvey') }}
            </span>
          </a>

          <!-- Language Switcher Toggle (TH / EN) -->
          <div class="relative grid grid-cols-2 items-center rounded-xl border border-brand-sand bg-brand-cream p-1 text-xs font-bold shadow-2xs">
            <span
              class="absolute bottom-1 left-1 top-1 w-[calc(50%-0.25rem)] rounded-lg bg-brand-chestnut shadow-warm-sm transition-transform duration-300 ease-out motion-reduce:transition-none"
              :class="currentLang === 'en' ? 'translate-x-full' : 'translate-x-0'"
              aria-hidden="true"
            ></span>
            <button 
              type="button"
              @click="$emit('lang-change', 'th')"
              class="relative z-10 cursor-pointer rounded-lg px-2.5 py-1 text-xs transition-colors duration-200 motion-reduce:transition-none"
              :class="currentLang === 'th' ? 'text-white' : 'text-brand-latte hover:text-brand-espresso'"
              :aria-pressed="currentLang === 'th'"
            >
              TH
            </button>
            <button 
              type="button"
              @click="$emit('lang-change', 'en')"
              class="relative z-10 cursor-pointer rounded-lg px-2.5 py-1 text-xs transition-colors duration-200 motion-reduce:transition-none"
              :class="currentLang === 'en' ? 'text-white' : 'text-brand-latte hover:text-brand-espresso'"
              :aria-pressed="currentLang === 'en'"
            >
              EN
            </button>
          </div>

          <button
            v-if="backendConfigured"
            @click="$emit(user ? 'sign-out' : 'sign-in')"
            class="hidden sm:inline-flex px-3 py-2 rounded-xl text-xs font-bold border border-brand-sand text-brand-chestnut hover:bg-brand-cream"
          >
            {{ user ? (isTh ? 'ออกจากระบบ' : 'Sign out') : (isTh ? 'เข้าสู่ระบบ' : 'Sign in') }}
          </button>

          <!-- Primary Post Trigger -->
          <button 
            @click="$emit('open-report', 'found')"
            class="inline-flex items-center gap-1.5 px-2.5 min-[360px]:px-4 py-2 rounded-xl text-xs font-bold bg-brand-chestnut hover:bg-brand-mocha text-white shadow-warm-xs transition-colors cursor-pointer"
            :aria-label="t('navReportFound')"
            :title="t('navReportFound')"
          >
            <PlusCircle class="w-3.5 h-3.5" />
            <span class="hidden min-[360px]:inline">{{ t('navReportFound') }}</span>
          </button>
        </div>

      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { Compass, PlusCircle, Mail } from 'lucide-vue-next'

const props = defineProps({
  activeTab: {
    type: String,
    default: 'home'
  },
  currentLang: {
    type: String,
    default: 'th'
  },
  myReportsCount: {
    type: Number,
    default: 0
  },
  emailsCount: {
    type: Number,
    default: 0
  },
  user: { type: Object, default: null },
  backendConfigured: { type: Boolean, default: false },
  t: {
    type: Function,
    required: true
  }
})

defineEmits([
  'nav-change', 
  'lang-change', 
  'open-report', 
  'open-emails',
  'sign-in',
  'sign-out'
])

const isTh = computed(() => props.currentLang === 'th')
</script>
