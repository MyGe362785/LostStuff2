<template>
  <section
    class="mb-6 rounded-2xl border border-brand-sand bg-brand-cream/35 p-3 sm:p-4"
    :aria-label="t('filterPanelLabel')"
  >
    <!-- Primary controls: status on the left, result presentation on the right -->
    <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
      <fieldset class="min-w-0">
        <legend class="mb-2 text-[11px] font-bold text-brand-mocha/70">
          {{ t('filterStatusLabel') }}
        </legend>
        <div class="grid w-full grid-cols-4 gap-1 rounded-xl bg-brand-paper p-1 sm:flex sm:w-fit">
          <button
            @click="$emit('update:selectedStatus', 'all')"
            class="min-h-9 min-w-0 rounded-lg px-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-caramel sm:px-3.5"
            :class="selectedStatus === 'all'
              ? 'bg-brand-chestnut text-white'
              : 'text-brand-mocha/70 hover:bg-brand-cream hover:text-brand-espresso'"
            :aria-pressed="selectedStatus === 'all'"
          >
            {{ t('filterAll') }}
          </button>

          <button
            @click="$emit('update:selectedStatus', 'lost')"
            class="flex min-h-9 min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lost/40 sm:px-3.5"
            :class="selectedStatus === 'lost'
              ? 'bg-lost-light text-lost-dark'
              : 'text-brand-mocha/70 hover:bg-lost-light/70 hover:text-lost-dark'"
            :aria-pressed="selectedStatus === 'lost'"
          >
            <span class="hidden h-2 w-2 rounded-full bg-lost sm:block" aria-hidden="true"></span>
            <span>{{ t('badgeLost') }}</span>
          </button>

          <button
            @click="$emit('update:selectedStatus', 'found')"
            class="flex min-h-9 min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-found/40 sm:px-3.5"
            :class="selectedStatus === 'found'
              ? 'bg-found-light text-found-dark'
              : 'text-brand-mocha/70 hover:bg-found-light/70 hover:text-found-dark'"
            :aria-pressed="selectedStatus === 'found'"
          >
            <span class="hidden h-2 w-2 rounded-full bg-found sm:block" aria-hidden="true"></span>
            <span>{{ t('badgeFound') }}</span>
          </button>

          <button
            @click="$emit('update:selectedStatus', 'returned')"
            class="flex min-h-9 min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-caramel sm:px-3.5"
            :class="selectedStatus === 'returned'
              ? 'bg-returned-light text-returned-dark'
              : 'text-brand-mocha/70 hover:bg-returned-light hover:text-brand-espresso'"
            :aria-pressed="selectedStatus === 'returned'"
          >
            <span class="hidden h-2 w-2 rounded-full bg-returned sm:block" aria-hidden="true"></span>
            <span>{{ t('statusReturned') }}</span>
          </button>
        </div>
      </fieldset>

      <div class="flex items-end gap-2">
        <label class="min-w-0 flex-1 lg:flex-none">
          <span class="mb-2 block text-[11px] font-bold text-brand-mocha/70">
            {{ t('sortLabel') }}
          </span>
          <span class="relative block">
            <select
              :value="selectedSort"
              @change="$emit('update:selectedSort', $event.target.value)"
              class="h-10 w-full appearance-none rounded-xl border border-brand-sand bg-brand-paper pl-9 pr-8 text-xs font-bold text-brand-espresso transition-colors hover:bg-brand-cream focus:outline-none focus:ring-2 focus:ring-brand-caramel/40 lg:w-48"
            >
              <option value="newest">{{ t('sortNewest') }}</option>
              <option value="highest_match">{{ t('sortHighestMatch') }}</option>
            </select>
            <ArrowUpDown class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-caramel" />
            <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-latte" />
          </span>
        </label>

        <div class="flex h-10 items-center rounded-xl border border-brand-sand bg-brand-paper p-1" :aria-label="t('viewModeLabel')">
          <button
            @click="$emit('update:viewMode', 'grid')"
            class="flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-caramel"
            :class="viewMode === 'grid' ? 'bg-brand-cream text-brand-chestnut' : 'text-brand-latte hover:text-brand-espresso'"
            :title="t('viewGrid')"
            :aria-label="t('viewGrid')"
            :aria-pressed="viewMode === 'grid'"
          >
            <LayoutGrid class="h-4 w-4" />
          </button>
          <button
            @click="$emit('update:viewMode', 'list')"
            class="flex h-8 w-8 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-caramel"
            :class="viewMode === 'list' ? 'bg-brand-cream text-brand-chestnut' : 'text-brand-latte hover:text-brand-espresso'"
            :title="t('viewList')"
            :aria-label="t('viewList')"
            :aria-pressed="viewMode === 'list'"
          >
            <List class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <div class="my-4 h-px bg-brand-sand/80" aria-hidden="true"></div>

    <!-- Category choices stay visible and wrap on larger screens -->
    <fieldset>
      <legend class="mb-2 text-[11px] font-bold text-brand-mocha/70">
        {{ t('filterCategoryLabel') }}
      </legend>
      <div class="filter-scroll flex flex-nowrap gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
        <button
          @click="$emit('update:selectedCategory', '')"
          class="flex min-h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border px-3 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-caramel"
          :class="!selectedCategory
            ? 'border-brand-chestnut bg-brand-chestnut text-white'
            : 'border-brand-sand bg-brand-paper text-brand-mocha hover:bg-brand-cream hover:text-brand-espresso'"
          :aria-pressed="!selectedCategory"
        >
          <Layers class="h-4 w-4" />
          <span>{{ t('filterCategory') }}</span>
        </button>

        <button
          v-for="cat in itemCategories"
          :key="cat.id"
          @click="$emit('update:selectedCategory', selectedCategory === cat.id ? '' : cat.id)"
          class="flex min-h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border px-3 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-caramel"
          :class="selectedCategory === cat.id
            ? 'border-brand-chestnut bg-brand-chestnut text-white'
            : 'border-brand-sand bg-brand-paper text-brand-mocha hover:bg-brand-cream hover:text-brand-espresso'"
          :aria-pressed="selectedCategory === cat.id"
        >
          <component :is="getCategoryIcon(cat.icon)" class="h-4 w-4" />
          <span>{{ isTh ? cat.nameTh : cat.nameEn }}</span>
        </button>
      </div>
    </fieldset>

    <div class="mt-4 flex flex-col gap-3 border-t border-brand-sand/80 pt-4 lg:flex-row lg:items-end lg:justify-between">
      <fieldset class="min-w-0 flex-1">
        <legend class="mb-2 flex items-center gap-2 text-[11px] font-bold text-brand-mocha/70">
          <span>{{ t('filterMoreLabel') }}</span>
          <span
            v-if="activeFilterCount > 0"
            class="rounded-full bg-brand-chestnut px-2 py-0.5 text-[10px] font-bold text-white"
          >
            {{ activeFilterCount }}
          </span>
        </legend>

        <div class="grid gap-2 sm:grid-cols-2 lg:max-w-2xl">
          <label class="relative block min-w-0">
            <span class="sr-only">{{ t('filterBuilding') }}</span>
            <select
              :value="selectedBuilding"
              @change="$emit('update:selectedBuilding', $event.target.value)"
              class="h-10 w-full appearance-none rounded-xl border pl-9 pr-8 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-caramel/40"
              :class="selectedBuilding
                ? 'border-brand-chestnut bg-brand-chestnut text-white'
                : 'border-brand-sand bg-brand-paper text-brand-mocha hover:bg-brand-cream'"
            >
              <option value="" class="bg-brand-paper text-brand-espresso">{{ t('filterBuilding') }}</option>
              <option
                v-for="bld in campusBuildings"
                :key="bld.id"
                :value="bld.id"
                class="bg-brand-paper text-brand-espresso"
              >
                {{ isTh ? bld.nameTh : bld.nameEn }}
              </option>
            </select>
            <MapPin class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" :class="selectedBuilding ? 'text-white' : 'text-brand-caramel'" />
            <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" :class="selectedBuilding ? 'text-white/80' : 'text-brand-latte'" />
          </label>

          <label class="relative block min-w-0">
            <span class="sr-only">{{ t('filterColor') }}</span>
            <select
              :value="selectedColor"
              @change="$emit('update:selectedColor', $event.target.value)"
              class="h-10 w-full appearance-none rounded-xl border pl-9 pr-8 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-caramel/40"
              :class="selectedColor
                ? 'border-brand-chestnut bg-brand-chestnut text-white'
                : 'border-brand-sand bg-brand-paper text-brand-mocha hover:bg-brand-cream'"
            >
              <option value="" class="bg-brand-paper text-brand-espresso">{{ t('filterColor') }}</option>
              <option
                v-for="c in colorOptions"
                :key="c.id"
                :value="c.id"
                class="bg-brand-paper text-brand-espresso"
              >
                {{ isTh ? c.nameTh : c.nameEn }} ({{ isTh ? c.nameEn : c.nameTh }})
              </option>
            </select>

            <span
              v-if="selectedColor"
              class="pointer-events-none absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-white/40"
              :style="{ backgroundColor: getColorHex(selectedColor) }"
            ></span>
            <Palette v-else class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-caramel" />
            <ChevronDown class="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" :class="selectedColor ? 'text-white/80' : 'text-brand-latte'" />
          </label>
        </div>
      </fieldset>

      <button
        v-if="hasActiveFilters"
        @click="clearAllFilters"
        class="inline-flex min-h-10 items-center justify-center gap-2 self-stretch rounded-xl border border-brand-sand bg-brand-paper px-4 text-xs font-bold text-brand-chestnut transition-colors hover:bg-brand-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-caramel lg:self-end"
        :title="t('btnResetFilters')"
      >
        <X class="h-4 w-4" />
        <span>{{ t('btnResetFilters') }}</span>
      </button>
    </div>
  </section>
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

const activeFilterCount = computed(() => {
  return [
    props.selectedStatus !== 'all',
    props.selectedCategory !== '',
    props.selectedColor !== '',
    props.selectedBuilding !== ''
  ].filter(Boolean).length
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

<style scoped>
.filter-scroll {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.filter-scroll::-webkit-scrollbar {
  display: none;
}
</style>
