<template>
  <!-- Grid View Card -->
  <div 
    v-if="viewMode === 'grid'"
    class="group rounded-xl bg-brand-paper border border-brand-sand/80 shadow-warm-sm hover:shadow-warm-md hover:border-brand-caramel/50 transition-all duration-200 overflow-hidden flex flex-col cursor-pointer relative"
    @click="$emit('select-item', item)"
  >
    <!-- Image Header with Badges -->
    <div class="relative h-48 w-full overflow-hidden bg-brand-cream/60">
      <img 
        :src="item.imageUrl" 
        :alt="isTh ? item.titleTh : item.titleEn"
        class="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 ease-out"
        loading="lazy"
      />
      
      <!-- Top Badges Overlay -->
      <div class="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
        <!-- 5-Stage Status Badge -->
        <span 
          class="px-2 py-0.5 rounded-md text-[11px] font-bold shadow-warm-sm flex items-center gap-1.5 border"
          :class="getStatusBadgeClass(item.status, item.type)"
        >
          <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(item.status, item.type)"></span>
          {{ getStatusLabel(item.status, item.type) }}
        </span>

        <!-- Match Score Badge (if high confidence) -->
        <span 
          v-if="item.matchScore"
          class="px-2 py-0.5 rounded-md text-[11px] font-bold bg-match-light text-match-dark border border-match-border shadow-warm-sm flex items-center gap-1"
        >
          <Zap class="w-3 h-3 fill-current" />
          {{ item.matchScore }}% Match
        </span>
      </div>

      <!-- Category Overlay -->
      <div class="absolute bottom-2.5 left-2.5 pointer-events-none">
        <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-brand-paper/95 text-brand-chestnut border border-brand-sand shadow-warm-sm flex items-center gap-1.5">
          <component :is="getCategoryIcon(item.category)" class="w-3 h-3" />
          {{ getCategoryName(item.category) }}
        </span>
      </div>
    </div>

    <!-- Content Details -->
    <div class="p-4 flex-1 flex flex-col justify-between">
      <div>
        <h3 class="font-bold text-sm text-brand-espresso group-hover:text-brand-chestnut transition-colors line-clamp-2 leading-snug">
          {{ isTh ? item.titleTh : item.titleEn }}
        </h3>
      </div>

      <!-- Location & Date Meta -->
      <div class="mt-3 pt-3 border-t border-brand-sand/60 space-y-1.5 text-xs text-brand-mocha/80">
        <div class="flex items-start gap-1.5">
          <MapPin class="w-3.5 h-3.5 text-brand-caramel shrink-0 mt-0.5" />
          <span class="truncate font-medium text-[11px]">{{ isTh ? item.locationDetailTh : item.locationDetailEn }}</span>
        </div>

        <div class="flex items-center justify-between text-[10px] text-brand-latte pt-0.5">
          <div class="flex items-center gap-1 font-medium">
            <Calendar class="w-3 h-3" />
            <span>{{ formatDate(item.date) }}</span>
          </div>
          <span v-if="item.isMyPost" class="px-1.5 py-0.2 rounded bg-brand-cream text-brand-chestnut font-bold border border-brand-sand">
            My Post
          </span>
        </div>
      </div>

      <!-- Action Button -->
      <div class="mt-3 pt-1">
        <button 
          @click.stop="$emit('select-item', item)"
          class="w-full py-2 px-3 rounded-lg bg-brand-cream hover:bg-brand-sand text-brand-chestnut font-bold text-xs transition-colors flex items-center justify-center gap-1"
        >
          <span>{{ t('btnViewDetails') }}</span>
          <ChevronRight class="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  </div>

  <!-- List View Card -->
  <div 
    v-else
    class="group rounded-xl bg-brand-paper border border-brand-sand/80 shadow-warm-sm hover:shadow-warm-md hover:border-brand-caramel/40 transition-all duration-200 p-3 flex flex-col sm:flex-row gap-3.5 items-start sm:items-center justify-between cursor-pointer"
    @click="$emit('select-item', item)"
  >
    <div class="flex gap-3 items-start sm:items-center min-w-0 flex-1">
      <!-- Thumbnail -->
      <div class="w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden bg-brand-cream/60 shrink-0 border border-brand-sand relative">
        <img :src="item.imageUrl" alt="" class="w-full h-full object-cover group-hover:scale-103 transition-transform" />
      </div>

      <!-- Details -->
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-1.5 mb-1">
          <!-- 5-Stage Status -->
          <span 
            class="px-2 py-0.5 rounded-md text-[10px] font-bold border"
            :class="getStatusBadgeClass(item.status, item.type)"
          >
            {{ getStatusLabel(item.status, item.type) }}
          </span>

          <!-- Category -->
          <span class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-brand-cream text-brand-mocha">
            {{ getCategoryName(item.category) }}
          </span>

          <span v-if="item.matchScore" class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-match-light text-match-dark border border-match-border">
            {{ item.matchScore }}% Match
          </span>
        </div>

        <h3 class="font-bold text-sm text-brand-espresso group-hover:text-brand-chestnut transition-colors truncate">
          {{ isTh ? item.titleTh : item.titleEn }}
        </h3>

        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-brand-mocha/70 mt-1">
          <span class="flex items-center gap-1 truncate">
            <MapPin class="w-3 h-3 text-brand-caramel shrink-0" />
            {{ isTh ? item.locationDetailTh : item.locationDetailEn }}
          </span>
          <span class="flex items-center gap-1 text-brand-latte">
            <Calendar class="w-3 h-3" />
            {{ formatDate(item.date) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Action Button -->
    <div class="w-full sm:w-auto shrink-0 flex items-center justify-end">
      <button 
        @click.stop="$emit('select-item', item)"
        class="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-brand-cream hover:bg-brand-chestnut hover:text-white text-brand-chestnut font-bold text-xs transition-colors flex items-center justify-center gap-1"
      >
        <span>{{ t('btnViewDetails') }}</span>
        <ChevronRight class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
  MapPin, Calendar, Zap, ChevronRight,
  Laptop, CreditCard, BookOpen, Watch, Key, HelpCircle 
} from 'lucide-vue-next'
import { itemCategories } from '../data/campusLocations'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  viewMode: {
    type: String,
    default: 'grid'
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

defineEmits(['select-item'])

const isTh = computed(() => props.currentLang === 'th')

// 5-Stage Status badge stylings (Proposal 3.2)
function getStatusBadgeClass(status, type) {
  if (status === 'pending_review') return 'bg-amber-100 text-amber-900 border-amber-300'
  if (status === 'pending_confirm') return 'bg-purple-100 text-purple-900 border-purple-300'
  if (status === 'matched') return 'bg-blue-100 text-blue-900 border-blue-300'
  if (status === 'returned') return 'bg-returned-light text-returned-dark border-returned-border'
  if (status === 'closed') return 'bg-stone-200 text-stone-700 border-stone-300'
  
  // Default searching:
  if (type === 'lost') return 'bg-lost-light text-lost-dark border-lost-border'
  return 'bg-found-light text-found-dark border-found-border'
}

function getStatusDotClass(status, type) {
  if (status === 'pending_review') return 'bg-amber-500 animate-pulse'
  if (status === 'pending_confirm') return 'bg-purple-500 animate-pulse'
  if (status === 'matched') return 'bg-blue-500'
  if (status === 'returned') return 'bg-returned'
  if (status === 'closed') return 'bg-stone-500'
  if (type === 'lost') return 'bg-lost'
  return 'bg-found'
}

function getStatusLabel(status, type) {
  if (status === 'pending_review') return props.t('statusPendingReview')
  if (status === 'pending_confirm') return props.t('statusPendingConfirm')
  if (status === 'matched') return props.t('statusMatched')
  if (status === 'returned') return props.t('statusReturned')
  if (status === 'closed') return props.t('statusClosed')
  if (type === 'lost') return props.t('badgeLost')
  return props.t('badgeFound')
}

function getCategoryName(categoryId) {
  const found = itemCategories.find(c => c.id === categoryId)
  if (!found) return categoryId
  return isTh.value ? found.nameTh : found.nameEn
}

function getCategoryIcon(categoryId) {
  const found = itemCategories.find(c => c.id === categoryId)
  const iconName = found ? found.icon : 'HelpCircle'
  const iconMap = { Laptop, CreditCard, BookOpen, Watch, Key, HelpCircle }
  return iconMap[iconName] || HelpCircle
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return isTh.value 
    ? d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
    : d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
