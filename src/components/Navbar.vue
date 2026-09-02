<template>
  <header class="sticky top-0 z-40 bg-brand-paper/95 backdrop-blur-md border-b border-brand-sand/70 transition-all">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-14 sm:h-15">
        
        <!-- Minimalist Brand Logo & Campus Tag -->
        <div class="flex items-center gap-2.5 cursor-pointer" @click="$emit('nav-change', 'home')">
          <div class="w-8 h-8 rounded-lg bg-brand-chestnut flex items-center justify-center text-white shadow-warm-sm">
            <Compass class="w-4.5 h-4.5 text-brand-paper" />
          </div>
          <span class="font-bold text-base tracking-tight text-brand-espresso">LostStuff<span class="text-brand-caramel">2</span></span>
          <span class="hidden sm:inline-block text-[10px] font-bold text-brand-latte border-l border-brand-sand pl-2 tracking-wider uppercase">
            Campus Portal
          </span>
        </div>

        <!-- Direct Text Navigation Links -->
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

        <!-- Quiet Action Cluster -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Bell -->
          <div class="relative">
            <button 
              @click="toggleNotificationTray"
              class="w-8.5 h-8.5 rounded-lg hover:bg-brand-cream text-brand-mocha transition-colors flex items-center justify-center relative focus:ring-2 focus:ring-brand-caramel/40"
              :aria-label="t('notifTitle')"
            >
              <Bell class="w-4 h-4" />
              <span 
                v-if="notifications.length > 0" 
                class="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-lost text-white text-[10px] font-bold flex items-center justify-center shadow-warm-sm animate-pulse"
              >
                {{ notifications.length }}
              </span>
            </button>
            <NotificationTray 
              v-if="isNotificationTrayOpen"
              :notifications="notifications"
              :currentLang="currentLang"
              :t="t"
              @clear-all="$emit('clear-notifications')"
              @select-match="handleSelectMatch"
            />
          </div>

          <!-- Language Switcher Toggle (TH / EN) -->
          <div class="flex items-center p-0.5 rounded-lg bg-brand-cream border border-brand-sand text-xs font-bold">
            <button 
              @click="$emit('lang-change', 'th')"
              class="px-2 py-0.5 rounded-md transition-all text-xs"
              :class="currentLang === 'th' ? 'bg-brand-chestnut text-white shadow-warm-sm' : 'text-brand-latte hover:text-brand-espresso'"
            >
              TH
            </button>
            <button 
              @click="$emit('lang-change', 'en')"
              class="px-2 py-0.5 rounded-md transition-all text-xs"
              :class="currentLang === 'en' ? 'bg-brand-chestnut text-white shadow-warm-sm' : 'text-brand-latte hover:text-brand-espresso'"
            >
              EN
            </button>
          </div>

          <!-- Unified Post Triggers -->
          <button 
            @click="$emit('open-report', 'lost')"
            class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-cream hover:bg-brand-sand text-brand-chestnut border border-brand-sand transition-colors"
          >
            <AlertCircle class="w-3.5 h-3.5" />
            <span>{{ t('navReportLost') }}</span>
          </button>

          <button 
            @click="$emit('open-report', 'found')"
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-brand-chestnut hover:bg-brand-mocha text-white shadow-warm-sm transition-colors"
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
import { ref } from 'vue'
import { Compass, Bell, AlertCircle, PlusCircle } from 'lucide-vue-next'
import NotificationTray from './NotificationTray.vue'

const props = defineProps({
  activeTab: {
    type: String,
    default: 'home'
  },
  currentLang: {
    type: String,
    default: 'th'
  },
  notifications: {
    type: Array,
    default: () => []
  },
  myReportsCount: {
    type: Number,
    default: 0
  },
  t: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['nav-change', 'lang-change', 'open-report', 'clear-notifications', 'view-match'])

const isNotificationTrayOpen = ref(false)

function toggleNotificationTray() {
  isNotificationTrayOpen.value = !isNotificationTrayOpen.value
}

function handleSelectMatch(notif) {
  isNotificationTrayOpen.value = false
  emit('view-match', notif)
}
</script>
