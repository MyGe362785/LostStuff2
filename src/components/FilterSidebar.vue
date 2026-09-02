<template>
  <div class="space-y-3 mb-6">
    
    <!-- Top Filter Controls Bar -->
    <div class="p-3 rounded-xl bg-brand-paper shadow-warm-sm border border-brand-sand flex flex-col lg:flex-row gap-3 justify-between items-stretch lg:items-center">
      
      <!-- Status Tabs Filter (All / Lost / Found / Returned) -->
      <div class="flex items-center gap-1 p-1 rounded-lg bg-brand-cream/80 border border-brand-sand/60 overflow-x-auto">
        <button 
          @click="$emit('update:selectedStatus', 'all')"
          class="px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap"
          :class="selectedStatus === 'all' ? 'bg-brand-paper text-brand-espresso shadow-warm-sm border border-brand-sand' : 'text-brand-mocha/70 hover:text-brand-espresso'"
        >
          {{ t('filterAll') }}
        </button>

        <button 
          @click="$emit('update:selectedStatus', 'lost')"
          class="px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap"
          :class="selectedStatus === 'lost' ? 'bg-lost-light text-lost-dark shadow-warm-sm border border-lost-border' : 'text-brand-mocha/70 hover:text-lost-dark'"
        >
          <span class="w-2 h-2 rounded-full bg-lost"></span>
          {{ t('filterLost') }}
        </button>

        <button 
          @click="$emit('update:selectedStatus', 'found')"
          class="px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap"
          :class="selectedStatus === 'found' ? 'bg-found-light text-found-dark shadow-warm-sm border border-found-border' : 'text-brand-mocha/70 hover:text-found-dark'"
        >
          <span class="w-2 h-2 rounded-full bg-found"></span>
          {{ t('filterFound') }}
        </button>

        <button 
          @click="$emit('update:selectedStatus', 'returned')"
          class="px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap"
          :class="selectedStatus === 'returned' ? 'bg-returned-light text-returned-dark shadow-warm-sm border border-returned-border' : 'text-brand-mocha/70 hover:text-returned-dark'"
        >
          <span class="w-2 h-2 rounded-full bg-returned"></span>
          {{ t('filterReturned') }}
        </button>
      </div>

      <!-- Campus Building Filter Dropdown & View Mode Switcher -->
      <div class="flex flex-wrap items-center gap-2 sm:gap-3">
        
        <!-- Campus Building Selector -->
        <div class="relative flex-1 sm:flex-initial">
          <select 
            :value="selectedBuilding"
            @change="$emit('update:selectedBuilding', $event.target.value)"
            class="w-full sm:w-56 appearance-none bg-brand-cream/60 hover:bg-brand-cream border border-brand-sand rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-espresso focus:outline-none focus:border-brand-caramel cursor-pointer pr-8"
          >
            <option value="">{{ t('filterBuilding') }}</option>
            <option 
              v-for="bld in campusBuildings" 
              :key="bld.id" 
              :value="bld.id"
            >
              {{ isTh ? bld.nameTh : bld.nameEn }}
            </option>
          </select>
          <Building2 class="w-3.5 h-3.5 text-brand-latte absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <!-- Sort Order Selector -->
        <div class="relative">
          <select 
            :value="selectedSort"
            @change="$emit('update:selectedSort', $event.target.value)"
            class="appearance-none bg-brand-cream/60 hover:bg-brand-cream border border-brand-sand rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-espresso focus:outline-none focus:border-brand-caramel cursor-pointer pr-8"
          >
            <option value="newest">{{ t('sortNewest') }}</option>
            <option value="highest_match">{{ t('sortHighestMatch') }}</option>
          </select>
          <ArrowUpDown class="w-3.5 h-3.5 text-brand-latte absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <!-- Grid / List Switcher -->
        <div class="flex items-center p-0.5 rounded-lg bg-brand-cream/80 border border-brand-sand/60">
          <button 
            @click="$emit('update:viewMode', 'grid')"
            class="p-1 rounded-md transition-all"
            :class="viewMode === 'grid' ? 'bg-brand-paper text-brand-chestnut shadow-warm-sm border border-brand-sand/60' : 'text-brand-latte hover:text-brand-espresso'"
            :title="t('viewGrid')"
          >
            <LayoutGrid class="w-4 h-4" />
          </button>
          <button 
            @click="$emit('update:viewMode', 'list')"
            class="p-1 rounded-md transition-all"
            :class="viewMode === 'list' ? 'bg-brand-paper text-brand-chestnut shadow-warm-sm border border-brand-sand/60' : 'text-brand-latte hover:text-brand-espresso'"
            :title="t('viewList')"
          >
            <List class="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>

    <!-- Category Pills Scrollable Row -->
    <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      <button 
        @click="$emit('update:selectedCategory', '')"
        class="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border shrink-0 flex items-center gap-1.5"
        :class="!selectedCategory ? 'bg-brand-chestnut text-white border-brand-chestnut shadow-warm-sm' : 'bg-brand-paper hover:bg-brand-cream text-brand-mocha border-brand-sand'"
      >
        <Layers class="w-3.5 h-3.5" />
        <span>{{ t('filterCategory') }}</span>
      </button>

      <button 
        v-for="cat in itemCategories" 
        :key="cat.id"
        @click="$emit('update:selectedCategory', cat.id)"
        class="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border shrink-0 flex items-center gap-1.5"
        :class="selectedCategory === cat.id ? 'bg-brand-chestnut text-white border-brand-chestnut shadow-warm-sm' : 'bg-brand-paper hover:bg-brand-cream text-brand-mocha border-brand-sand'"
      >
        <component :is="getCategoryIcon(cat.icon)" class="w-3.5 h-3.5" />
        <span>{{ isTh ? cat.nameTh : cat.nameEn }}</span>
      </button>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
  Building2, ArrowUpDown, LayoutGrid, List, Layers,
  Laptop, CreditCard, BookOpen, Watch, Key, HelpCircle 
} from 'lucide-vue-next'
import { itemCategories, campusBuildings } from '../data/campusLocations'

const props = defineProps({
  selectedStatus: {
    type: String,
    default: 'all'
  },
  selectedCategory: {
    type: String,
    default: ''
  },
  selectedBuilding: {
    type: String,
    default: ''
  },
  selectedSort: {
    type: String,
    default: 'newest'
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

defineEmits([
  'update:selectedStatus', 
  'update:selectedCategory', 
  'update:selectedBuilding', 
  'update:selectedSort', 
  'update:viewMode'
])

const isTh = computed(() => props.currentLang === 'th')

function getCategoryIcon(iconName) {
  const iconMap = {
    Laptop,
    CreditCard,
    BookOpen,
    Watch,
    Key,
    HelpCircle
  }
  return iconMap[iconName] || HelpCircle
}
</script>
