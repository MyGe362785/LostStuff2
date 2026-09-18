<template>
  <div class="space-y-6">
    
    <!-- Header -->
    <div class="p-5 rounded-xl bg-brand-paper border border-brand-sand shadow-warm-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl sm:text-2xl font-extrabold text-brand-espresso">
          {{ t('myTrackerTitle') }}
        </h2>
        <p class="text-xs sm:text-sm text-brand-mocha/70 mt-0.5">
          {{ t('myTrackerSubtitle') }}
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button 
          @click="$emit('open-report', 'lost')"
          class="px-3.5 py-2 rounded-lg bg-lost-light hover:bg-lost/20 text-lost-dark border border-lost-border font-bold text-xs transition-all shadow-warm-sm"
        >
          + {{ t('navReportLost') }}
        </button>
        <button 
          @click="$emit('open-report', 'found')"
          class="px-3.5 py-2 rounded-lg bg-brand-chestnut hover:bg-brand-mocha text-white font-bold text-xs transition-all shadow-warm-sm"
        >
          + {{ t('navReportFound') }}
        </button>
      </div>
    </div>

    <!-- My Items List -->
    <div v-if="myItems.length === 0" class="p-10 text-center rounded-xl bg-brand-paper border border-brand-sand flex flex-col items-center gap-3">
      <Inbox class="w-10 h-10 text-brand-tan" />
      <p class="text-sm font-semibold text-brand-latte">{{ t('noMyPosts') }}</p>
      <button 
        @click="$emit('open-report', 'lost')"
        class="mt-1 px-5 py-2 rounded-lg bg-brand-chestnut text-white font-bold text-xs"
      >
        {{ t('btnPostNow') }}
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
      <div 
        v-for="item in myItems" 
        :key="item.id"
        class="p-4 rounded-xl bg-brand-paper border border-brand-sand shadow-warm-sm flex flex-col justify-between"
      >
        <div class="flex gap-3.5">
          <div class="w-18 h-18 rounded-lg overflow-hidden bg-brand-cream shrink-0 border border-brand-sand">
            <img
              :src="item.imageUrl"
              :alt="isTh ? item.titleTh : item.titleEn"
              class="block w-full h-full max-w-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span 
                class="px-2 py-0.5 rounded-md text-[10px] font-bold"
                :class="item.status === 'returned' ? 'bg-returned-light text-returned-dark' : (item.type === 'lost' ? 'bg-lost-light text-lost-dark' : 'bg-found-light text-found-dark')"
              >
                {{ item.status === 'returned' ? t('badgeReturned') : (item.type === 'lost' ? t('badgeLost') : t('badgeFound')) }}
              </span>
              <span class="text-[10px] text-brand-latte">{{ item.date }}</span>
            </div>

            <h3 class="font-bold text-sm text-brand-espresso truncate">
              {{ isTh ? item.titleTh : item.titleEn }}
            </h3>

            <p class="text-xs text-brand-mocha/70 truncate mt-0.5">
              {{ isTh ? item.locationDetailTh : item.locationDetailEn }}
            </p>
          </div>
        </div>

        <div class="mt-3.5 pt-2.5 border-t border-brand-sand/60 flex items-center justify-between gap-2">
          <button 
            @click="$emit('select-item', item)"
            class="text-xs font-bold text-brand-chestnut hover:text-brand-mocha"
          >
            {{ t('btnViewDetails') }}
          </button>

          <button 
            v-if="allowStatusChanges && item.status !== 'returned'"
            @click="$emit('mark-returned', item.id)"
            class="px-2.5 py-1.5 rounded-lg bg-found-light hover:bg-found/20 text-found-dark text-xs font-bold border border-found-border transition-colors flex items-center gap-1"
          >
            <CheckCircle2 class="w-3.5 h-3.5" />
            <span>{{ t('btnMarkReturned') }}</span>
          </button>
          <span v-else class="text-xs font-bold text-found flex items-center gap-1">
            <CheckCircle2 class="w-3.5 h-3.5" />
            {{ isTh ? 'รับคืนแล้ว' : 'Returned' }}
          </span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Inbox, CheckCircle2 } from 'lucide-vue-next'

const props = defineProps({
  myItems: {
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
  },
  allowStatusChanges: { type: Boolean, default: true }
})

defineEmits(['open-report', 'select-item', 'mark-returned'])

const isTh = computed(() => props.currentLang === 'th')
</script>
