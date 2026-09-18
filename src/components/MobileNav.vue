<template>
  <!-- Phones get the same destinations as the desktop navbar links, which hide below md -->
  <nav
    class="md:hidden fixed bottom-0 inset-x-0 z-40 bg-brand-paper/95 backdrop-blur-md border-t border-brand-sand/70 pb-[env(safe-area-inset-bottom)]"
    :aria-label="isTh ? 'เมนูหลัก' : 'Main navigation'"
  >
    <div class="grid h-16" :class="backendConfigured ? 'grid-cols-5' : 'grid-cols-4'">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors"
        :class="activeTab === tab.id ? 'text-brand-chestnut' : 'text-brand-mocha/70 hover:text-brand-espresso'"
        :aria-current="activeTab === tab.id ? 'page' : undefined"
        @click="$emit('nav-change', tab.id)"
      >
        <component :is="tab.icon" class="w-5 h-5" />
        <span class="leading-tight">{{ tab.label }}</span>
        <span
          v-if="tab.id === 'my-posts' && myReportsCount > 0"
          class="absolute top-2 left-1/2 ml-2 min-w-[16px] h-4 px-1 rounded-full bg-brand-chestnut text-white text-[9px] font-bold flex items-center justify-center"
        >
          {{ myReportsCount }}
        </span>
      </button>

      <button
        v-if="backendConfigured"
        class="flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold text-brand-mocha/70 hover:text-brand-espresso transition-colors"
        @click="$emit(user ? 'sign-out' : 'sign-in')"
      >
        <component :is="user ? LogOut : LogIn" class="w-5 h-5" />
        <span class="leading-tight">{{ user ? (isTh ? 'ออกจากระบบ' : 'Sign out') : (isTh ? 'เข้าสู่ระบบ' : 'Sign in') }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { ClipboardList, House, LogIn, LogOut, MapPin, Search } from 'lucide-vue-next'

const props = defineProps({
  activeTab: { type: String, default: 'home' },
  currentLang: { type: String, default: 'th' },
  myReportsCount: { type: Number, default: 0 },
  user: { type: Object, default: null },
  backendConfigured: { type: Boolean, default: false },
  t: { type: Function, required: true },
})

defineEmits(['nav-change', 'sign-in', 'sign-out'])

const isTh = computed(() => props.currentLang === 'th')

const tabs = computed(() => [
  { id: 'home', icon: House, label: props.t('navHome') },
  { id: 'search', icon: Search, label: isTh.value ? 'ค้นหา' : 'Search' },
  { id: 'my-posts', icon: ClipboardList, label: props.t('navMyReports') },
  { id: 'locations', icon: MapPin, label: isTh.value ? 'จุดรับ-ส่ง' : 'Drop-off' },
])
</script>
