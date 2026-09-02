<template>
  <div 
    class="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-brand-paper shadow-warm-xl border border-brand-sand/80 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
  >
    <!-- Header -->
    <div class="px-4 py-3.5 bg-brand-cream/80 border-b border-brand-sand flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="p-1.5 rounded-lg bg-brand-chestnut/10 text-brand-chestnut">
          <Bell class="w-4 h-4" />
        </span>
        <h3 class="font-semibold text-sm text-brand-espresso">
          {{ t('notifTitle') }}
        </h3>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="notifications.length" class="px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-caramel/15 text-brand-chestnut">
          {{ notifications.length }}
        </span>
        <button 
          v-if="notifications.length" 
          @click="$emit('clear-all')"
          class="text-xs text-brand-latte hover:text-brand-chestnut transition-colors"
        >
          {{ t('notifClear') }}
        </button>
      </div>
    </div>

    <!-- Notification List -->
    <div class="max-h-80 overflow-y-auto divide-y divide-brand-sand/50">
      <div 
        v-if="notifications.length === 0" 
        class="py-10 px-4 text-center text-brand-latte flex flex-col items-center gap-2"
      >
        <BellOff class="w-8 h-8 text-brand-tan" />
        <p class="text-xs">{{ t('notifEmpty') }}</p>
      </div>

      <div 
        v-for="notif in notifications" 
        :key="notif.id"
        @click="$emit('select-match', notif)"
        class="p-3.5 hover:bg-brand-cream/50 transition-all cursor-pointer group flex gap-3 items-start"
      >
        <div class="w-10 h-10 rounded-xl overflow-hidden bg-brand-sand shrink-0 border border-brand-tan/40 relative">
          <img :src="notif.matchedItem.imageUrl" alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          <span 
            class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white"
            :class="notif.matchedItem.type === 'lost' ? 'bg-lost' : 'bg-found'"
          ></span>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-1 mb-1">
            <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-match-light text-match-dark border border-match-border">
              {{ notif.matchScore }}% {{ t('matchScoreLabel') }}
            </span>
            <span class="text-[10px] text-brand-latte">{{ notif.timeAgo }}</span>
          </div>
          <p class="text-xs font-semibold text-brand-espresso truncate group-hover:text-brand-chestnut transition-colors">
            {{ isTh ? notif.matchedItem.titleTh : notif.matchedItem.titleEn }}
          </p>
          <p class="text-[11px] text-brand-mocha/70 truncate mt-0.5">
            {{ isTh ? notif.matchedItem.locationDetailTh : notif.matchedItem.locationDetailEn }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Bell, BellOff } from 'lucide-vue-next'

const props = defineProps({
  notifications: {
    type: Array,
    default: () => []
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

defineEmits(['clear-all', 'select-match'])

const isTh = computed(() => props.currentLang === 'th')
import { computed } from 'vue'
</script>
