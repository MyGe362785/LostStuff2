<template>
  <div class="space-y-3 mb-6">
    
    <!-- Top Row: Primary Type Switcher + View/Sort Controls -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      
      <!-- Primary Segmented Pill (Type: All / Lost / Found / Returned) -->
      <div class="p-1 rounded-2xl bg-brand-cream/80 border border-brand-sand flex items-center gap-1 overflow-x-auto scrollbar-none shadow-2xs">
        <button 
          @click="$emit('update:selectedStatus', 'all')"
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer"
          :class="selectedStatus === 'all' 
            ? 'bg-brand-paper text-brand-espresso shadow-warm-xs border border-brand-sand/80' 
            : 'text-brand-mocha/70 hover:text-brand-espresso'"
        >
          {{ t('filterAll') }}
        </button>

        <button 
          @click="$emit('update:selectedStatus', 'lost')"
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          :class="selectedStatus === 'lost' 
            ? 'bg-lost-light text-lost-dark shadow-warm-xs border border-lost-border' 
            : 'text-brand-mocha/70 hover:text-lost-dark'"
        >
          <span class="w-2 h-2 rounded-full bg-lost"></span>
          <span>{{ t('badgeLost') }}</span>
        </button>

        <button 
          @click="$emit('update:selectedStatus', 'found')"
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          :class="selectedStatus === 'found' 
            ? 'bg-found-light text-found-dark shadow-warm-xs border border-found-border' 
            : 'text-brand-mocha/70 hover:text-found-dark'"
        >
          <span class="w-2 h-2 rounded-full bg-found"></span>
          <span>{{ t('badgeFound') }}</span>
        </button>

        <button 
          @click="$emit('update:selectedStatus', 'returned')"
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          :class="selectedStatus === 'returned' 
            ? 'bg-returned-light text-returned-dark shadow-warm-xs border border-returned-border' 
            : 'text-brand-mocha/70 hover:text-brand-espresso'"
        >
          <span class="w-2 h-2 rounded-full bg-returned"></span>
          <span>{{ t('statusReturned') }}</span>
        </button>
      </div>

      <!-- Right Side: Minimal Sort Dropdown & Grid/List View Mode -->
      <div class="flex items-center gap-2 self-end sm:self-center">
        
        <!-- Sort Select with subtle minimal pill styling -->
        <div class="relative">
          <select 
            :value="selectedSort"
            @change="$emit('update:selectedSort', $event.target.value)"
            class="appearance-none bg-brand-paper hover:bg-brand-cream border border-brand-sand rounded-xl pl-8 pr-7 py-1.5 text-xs font-bold text-brand-espresso focus:outline-hidden focus:ring-2 focus:ring-brand-caramel/40 cursor-pointer shadow-2xs transition-all"
            :title="isTh ? 'เรียงลำดับ' : 'Sort order'"
          >
            <option value="newest">{{ t('sortNewest') }}</option>
            <option value="highest_match">{{ t('sortHighestMatch') }}</option>
          </select>
          <ArrowUpDown class="w-3.5 h-3.5 text-brand-latte absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <ChevronDown class="w-3 h-3 text-brand-latte absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <!-- View Mode Switcher -->
        <div class="flex items-center p-0.5 rounded-xl bg-brand-cream/80 border border-brand-sand shadow-2xs">
          <button 
            @click="$emit('update:viewMode', 'grid')"
            class="p-1.5 rounded-lg transition-all cursor-pointer"
            :class="viewMode === 'grid' ? 'bg-brand-paper text-brand-chestnut shadow-warm-xs border border-brand-sand/60' : 'text-brand-latte hover:text-brand-espresso'"
            :title="t('viewGrid')"
          >
            <LayoutGrid class="w-3.5 h-3.5" />
          </button>
          <button 
            @click="$emit('update:viewMode', 'list')"
            class="p-1.5 rounded-lg transition-all cursor-pointer"
            :class="viewMode === 'list' ? 'bg-brand-paper text-brand-chestnut shadow-warm-xs border border-brand-sand/60' : 'text-brand-latte hover:text-brand-espresso'"
            :title="t('viewList')"
          >
            <List class="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>

    <!-- Category Pills: Horizontal Scroll with Soft Icons -->
    <div class="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
      <button 
        @click="$emit('update:selectedCategory', '')"
        class="px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 flex items-center gap-1.5 cursor-pointer"
        :class="!selectedCategory 
          ? 'bg-brand-chestnut text-white border-brand-chestnut shadow-warm-xs' 
          : 'bg-brand-paper hover:bg-brand-cream text-brand-mocha border-brand-sand hover:border-brand-sand/80'"
      >
        <Layers class="w-3.5 h-3.5" />
        <span>{{ t('filterCategory') }}</span>
      </button>

      <button 
        v-for="cat in itemCategories" 
        :key="cat.id"
        @click="$emit('update:selectedCategory', selectedCategory === cat.id ? '' : cat.id)"
        class="px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 flex items-center gap-1.5 cursor-pointer"
        :class="selectedCategory === cat.id 
          ? 'bg-brand-chestnut text-white border-brand-chestnut shadow-warm-xs' 
          : 'bg-brand-paper hover:bg-brand-cream text-brand-mocha border-brand-sand hover:border-brand-sand/80'"
      >
        <component :is="getCategoryIcon(cat.icon)" class="w-3.5 h-3.5" />
        <span>{{ isTh ? cat.nameTh : cat.nameEn }}</span>
      </button>
    </div>

    <!-- Minimal Refinement Filter Pills (Location, Color, Reset) -->
    <div class="flex flex-wrap items-center gap-2 pt-1">
      
      <!-- Campus Building Filter Pill -->
      <div class="relative">
        <select 
          :value="selectedBuilding"
          @change="$emit('update:selectedBuilding', $event.target.value)"
          class="appearance-none rounded-xl pl-8 pr-7 py-1.5 text-xs font-bold transition-all cursor-pointer border shadow-2xs"
          :class="selectedBuilding 
            ? 'bg-brand-chestnut text-white border-brand-chestnut shadow-warm-xs' 
            : 'bg-brand-paper hover:bg-brand-cream text-brand-mocha border-brand-sand hover:border-brand-sand/80'"
        >
          <option value="" class="bg-brand-paper text-brand-espresso">{{ isTh ? 'ทุกอาคาร/สถานที่' : 'All Buildings' }}</option>
          <option 
            v-for="bld in campusBuildings" 
            :key="bld.id" 
            :value="bld.id"
            class="bg-brand-paper text-brand-espresso"
          >
            {{ isTh ? bld.nameTh : bld.nameEn }}
          </option>
        </select>
        <MapPin class="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" :class="selectedBuilding ? 'text-white' : 'text-brand-caramel'" />
        <ChevronDown class="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" :class="selectedBuilding ? 'text-white/80' : 'text-brand-latte'" />
      </div>

      <!-- Color Filter Pill -->
      <div class="relative">
        <select
          :value="selectedColor"
          @change="$emit('update:selectedColor', $event.target.value)"
          class="appearance-none rounded-xl pl-8 pr-7 py-1.5 text-xs font-bold transition-all cursor-pointer border shadow-2xs"
          :class="selectedColor 
            ? 'bg-brand-chestnut text-white border-brand-chestnut shadow-warm-xs' 
            : 'bg-brand-paper hover:bg-brand-cream text-brand-mocha border-brand-sand hover:border-brand-sand/80'"
        >
          <option value="" class="bg-brand-paper text-brand-espresso">{{ isTh ? 'ทุกสี' : 'All Colors' }}</option>
          <option 
            v-for="c in colorOptions" 
            :key="c.id" 
            :value="c.id" 
            class="bg-brand-paper text-brand-espresso"
          >
            {{ isTh ? c.nameTh : c.nameEn }} ({{ isTh ? c.nameEn : c.nameTh }})
          </option>
        </select>
        
        <!-- Swatch preview circle or palette icon -->
        <span 
          v-if="selectedColor"
          class="w-2.5 h-2.5 rounded-full border border-white/40 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
          :style="{ backgroundColor: getColorHex(selectedColor) }"
        ></span>
        <Palette v-else class="w-3.5 h-3.5 text-brand-latte absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        
        <ChevronDown class="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" :class="selectedColor ? 'text-white/80' : 'text-brand-latte'" />
      </div>

      <!-- Quick Reset Button when any filter is active -->
      <button 
        v-if="hasActiveFilters"
        @click="clearAllFilters"
        class="px-3 py-1.5 rounded-xl bg-brand-cream hover:bg-brand-sand text-brand-chestnut hover:text-brand-espresso text-xs font-bold transition-all flex items-center gap-1.5 border border-brand-sand/80 shadow-2xs cursor-pointer"
        :title="t('btnResetFilters')"
      >
        <X class="w-3.5 h-3.5 text-brand-latte" />
        <span>{{ isTh ? 'ล้างตัวกรอง' : 'Clear Filters' }}</span>
      </button>

    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
  ArrowUpDown, LayoutGrid, List, Layers, Palette, MapPin, ChevronDown, X,
  Laptop, CreditCard, BookOpen, Watch, Key, HelpCircle 
} from 'lucide-vue-next'
import { itemCategories, campusBuildings } from '../data/campusLocations'
import { colorOptions, getColorHex } from '../data/colors'

const props = defineProps({
  selectedStatus: {
    type: String,
    default: 'all'
  },
  selectedCategory: {
    type: String,
    default: ''
  },
  selectedColor: {
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

const emit = defineEmits([
  'update:selectedStatus', 
  'update:selectedCategory', 
  'update:selectedColor',
  'update:selectedBuilding', 
  'update:selectedSort', 
  'update:viewMode'
])

const isTh = computed(() => props.currentLang === 'th')

const hasActiveFilters = computed(() => {
  return props.selectedCategory !== '' || 
         props.selectedColor !== '' || 
         props.selectedBuilding !== '' || 
         props.selectedStatus !== 'all'
})

function clearAllFilters() {
  emit('update:selectedStatus', 'all')
  emit('update:selectedCategory', '')
  emit('update:selectedColor', '')
  emit('update:selectedBuilding', '')
  emit('update:selectedSort', 'newest')
}


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
