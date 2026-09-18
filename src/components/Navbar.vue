<template>
  <header class="sticky top-0 z-40 bg-brand-paper/95 backdrop-blur-md border-b border-brand-sand/70 transition-all">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-14 sm:h-16">
        
        <!-- Brand Logo & Campus Tag -->
        <div class="flex items-center gap-2.5 cursor-pointer" @click="$emit('nav-change', 'home')">
          <div class="w-8 h-8 rounded-lg bg-brand-chestnut flex items-center justify-center text-white shadow-warm-sm">
            <Compass class="w-4.5 h-4.5 text-brand-paper" />
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-base tracking-tight text-brand-espresso">LostStuff<span class="text-brand-caramel">2</span></span>
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
            class="transition-colors py-1 relative"
            :class="activeTab === 'home' ? 'text-brand-chestnut font-bold border-b-2 border-brand-chestnut' : 'text-brand-mocha/70 hover:text-brand-espresso'"
          >
            {{ t('navHome') }}
          </button>
          
          <button 
            @click="$emit('nav-change', 'search')"
            class="transition-colors py-1 relative"
            :class="activeTab === 'search' ? 'text-brand-chestnut font-bold border-b-2 border-brand-chestnut' : 'text-brand-mocha/70 hover:text-brand-espresso'"
          >
            {{ t('navSearch') }}
          </button>
          
          <button 
            @click="$emit('nav-change', 'my-posts')"
            class="transition-colors py-1 relative flex items-center gap-1.5"
            :class="activeTab === 'my-posts' ? 'text-brand-chestnut font-bold border-b-2 border-brand-chestnut' : 'text-brand-mocha/70 hover:text-brand-espresso'"
          >
            {{ t('navMyReports') }}
            <span v-if="myReportsCount > 0" class="px-1.5 py-0.2 rounded-full text-[10px] bg-brand-cream text-brand-chestnut font-bold border border-brand-sand">
              {{ myReportsCount }}
            </span>
          </button>

          <button 
            @click="$emit('nav-change', 'locations')"
            class="transition-colors py-1 relative"
            :class="activeTab === 'locations' ? 'text-brand-chestnut font-bold border-b-2 border-brand-chestnut' : 'text-brand-mocha/70 hover:text-brand-espresso'"
          >
            {{ t('navLocations') }}
          </button>
        </nav>

        <!-- Right Action Cluster -->
        <div class="flex items-center gap-2 sm:gap-2.5">
          
          <!-- Primary Notification: Email Mailbox Icon (Replaces Bell) -->
          <button
            @click="$emit('open-emails')"
            class="w-10 h-10 rounded-xl hover:bg-brand-cream/80 text-brand-mocha transition-all flex items-center justify-center relative border border-transparent hover:border-brand-sand"
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

          <!-- Language Switcher Toggle (TH / EN) -->
          <div class="flex items-center p-1 rounded-xl bg-brand-cream border border-brand-sand text-xs font-bold shadow-2xs">
            <button 
              @click="$emit('lang-change', 'th')"
              class="px-2.5 py-1 rounded-lg transition-all text-xs cursor-pointer"
              :class="currentLang === 'th' ? 'bg-brand-chestnut text-white shadow-warm-xs' : 'text-brand-latte hover:text-brand-espresso'"
            >
              TH
            </button>
            <button 
              @click="$emit('lang-change', 'en')"
              class="px-2.5 py-1 rounded-lg transition-all text-xs cursor-pointer"
              :class="currentLang === 'en' ? 'bg-brand-chestnut text-white shadow-warm-xs' : 'text-brand-latte hover:text-brand-espresso'"
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
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-chestnut hover:bg-brand-mocha text-white shadow-warm-xs transition-colors cursor-pointer"
          >
            <PlusCircle class="w-3.5 h-3.5" />
            <span>{{ t('navReportFound') }}</span>
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
