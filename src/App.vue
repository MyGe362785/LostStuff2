<template>
  <div class="min-h-screen flex flex-col bg-brand-paper text-brand-espresso">
    
    <!-- Navbar -->
    <Navbar 
      :activeTab="activeTab"
      :currentLang="currentLang"
      :notifications="notifications"
      :myReportsCount="myItems.length"
      :t="t"
      @nav-change="handleNavChange"
      @lang-change="handleLangChange"
      @open-report="openReportModal"
      @clear-notifications="clearNotifications"
      @view-match="handleViewMatchNotification"
    />

    <!-- Main Content Container -->
    <main class="flex-1">
      
      <!-- TAB: HOME -->
      <div v-if="activeTab === 'home'">
        <!-- Hero Search & Action Centerpiece -->
        <HeroBanner 
          v-model:searchQuery="searchQuery"
          :activeLostCount="activeLostCount"
          :currentLang="currentLang"
          :t="t"
          @trigger-search="activeTab = 'search'"
          @open-report="openReportModal"
        />

        <!-- Discovery Feed Preview on Home -->
        <section class="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-extrabold text-brand-espresso">{{ t('hubTitle') }}</h2>
              <p class="text-xs text-brand-mocha/70 mt-0.5">{{ t('hubSubtitle') }}</p>
            </div>
            <button 
              @click="activeTab = 'search'"
              class="text-xs font-bold text-brand-chestnut hover:text-brand-mocha flex items-center gap-1"
            >
              <span>{{ isTh ? 'ดูทั้งหมด' : 'View All' }}</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </button>
          </div>

          <!-- Filters -->
          <FilterSidebar 
            v-model:selectedStatus="selectedStatus"
            v-model:selectedCategory="selectedCategory"
            v-model:selectedBuilding="selectedBuilding"
            v-model:selectedSort="selectedSort"
            v-model:viewMode="viewMode"
            :currentLang="currentLang"
            :t="t"
          />

          <!-- Items Grid / List -->
          <div v-if="filteredItems.length === 0" class="py-16 text-center bg-brand-cream/30 rounded-xl border border-brand-sand/70 p-6">
            <p class="text-sm font-semibold text-brand-latte mb-3">{{ t('noItemsFound') }}</p>
            <button 
              @click="resetFilters"
              class="px-4 py-2 rounded-lg bg-brand-sand text-brand-chestnut text-xs font-bold"
            >
              {{ t('btnResetFilters') }}
            </button>
          </div>

          <div 
            v-else 
            :class="viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-3'"
          >
            <ItemCard 
              v-for="item in filteredItems" 
              :key="item.id"
              :item="item"
              :viewMode="viewMode"
              :currentLang="currentLang"
              :t="t"
              @select-item="openItemDetail"
            />
          </div>
        </section>

        <!-- Campus Handover Points Directory -->
        <CampusHandoverSection :currentLang="currentLang" :t="t" />

        <!-- Recovery Statistics Section -->
        <section class="py-12 border-t border-brand-sand/60 bg-gradient-to-b from-brand-cream/30 to-transparent">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="max-w-4xl mx-auto rounded-xl bg-brand-paper border border-brand-sand shadow-warm-sm overflow-hidden">
              <div class="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-brand-sand/80">
                
                <div class="p-4 flex flex-col items-center text-center">
                  <span class="text-[11px] text-brand-mocha/70 font-semibold mb-1 uppercase tracking-wider">{{ t('statReturnedRate') }}</span>
                  <div class="flex items-center gap-1.5">
                    <span class="text-xl sm:text-2xl font-bold text-brand-espresso">{{ '94.2%' }}</span>
                    <span class="w-2 h-2 rounded-full bg-found"></span>
                  </div>
                </div>

                <div class="p-4 flex flex-col items-center text-center">
                  <span class="text-[11px] text-brand-mocha/70 font-semibold mb-1 uppercase tracking-wider">{{ t('statReturnedCount') }}</span>
                  <span class="text-xl sm:text-2xl font-bold text-brand-espresso">1,280+</span>
                </div>

                <div class="p-4 flex flex-col items-center text-center">
                  <span class="text-[11px] text-brand-mocha/70 font-semibold mb-1 uppercase tracking-wider">{{ t('statActivePosts') }}</span>
                  <div class="flex items-center gap-1.5">
                    <span class="text-xl sm:text-2xl font-bold text-brand-espresso">{{ activeLostCount }}</span>
                    <span class="w-2 h-2 rounded-full bg-lost animate-pulse"></span>
                  </div>
                </div>

                <div class="p-4 flex flex-col items-center text-center">
                  <span class="text-[11px] text-brand-mocha/70 font-semibold mb-1 uppercase tracking-wider">{{ t('statAvgMatchTime') }}</span>
                  <span class="text-xl sm:text-2xl font-bold text-brand-espresso">15 <span class="text-xs font-normal text-brand-mocha/70">{{ t('statMinutes') }}</span></span>
                </div>

              </div>
            </div>
          </div>
        </section>

        <!-- How It Works 3-Step Workflow Section -->
        <section class="py-12 border-t border-brand-sand/50 bg-brand-cream/30">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-xl mx-auto mb-8">
              <span class="text-[11px] font-semibold text-brand-caramel uppercase tracking-wider">Workflow</span>
              <h2 class="text-xl sm:text-2xl font-bold text-brand-espresso mt-1">
                {{ t('howItWorksTitle') }}
              </h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <!-- Step 1 -->
              <div class="p-5 rounded-xl bg-brand-paper border border-brand-sand shadow-warm-sm flex flex-col items-start">
                <div class="w-10 h-10 rounded-lg bg-lost-light text-lost-dark flex items-center justify-center mb-3">
                  <FileText class="w-5 h-5" />
                </div>
                <h3 class="font-bold text-sm text-brand-espresso mb-1.5">{{ t('howStep1Title') }}</h3>
                <p class="text-xs text-brand-mocha/75 leading-relaxed">{{ t('howStep1Desc') }}</p>
              </div>

              <!-- Step 2 -->
              <div class="p-5 rounded-xl bg-brand-paper border border-brand-sand shadow-warm-sm flex flex-col items-start">
                <div class="w-10 h-10 rounded-lg bg-brand-cream text-brand-chestnut flex items-center justify-center mb-3">
                  <Cpu class="w-5 h-5" />
                </div>
                <h3 class="font-bold text-sm text-brand-espresso mb-1.5">{{ t('howStep2Title') }}</h3>
                <p class="text-xs text-brand-mocha/75 leading-relaxed">{{ t('howStep2Desc') }}</p>
              </div>

              <!-- Step 3 -->
              <div class="p-5 rounded-xl bg-brand-paper border border-brand-sand shadow-warm-sm flex flex-col items-start">
                <div class="w-10 h-10 rounded-lg bg-found-light text-found-dark flex items-center justify-center mb-3">
                  <ShieldCheck class="w-5 h-5" />
                </div>
                <h3 class="font-bold text-sm text-brand-espresso mb-1.5">{{ t('howStep3Title') }}</h3>
                <p class="text-xs text-brand-mocha/75 leading-relaxed">{{ t('howStep3Desc') }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- FAQ Section -->
        <FaqSection :currentLang="currentLang" :t="t" />
      </div>

      <!-- TAB: SEARCH & DISCOVERY HUB -->
      <div v-else-if="activeTab === 'search'" class="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-6">
          <h1 class="text-2xl sm:text-3xl font-extrabold text-brand-espresso mb-1">
            {{ t('hubTitle') }}
          </h1>
          <p class="text-xs sm:text-sm text-brand-mocha/70">
            {{ t('hubSubtitle') }}
          </p>
        </div>

        <!-- Filter Controls -->
        <FilterSidebar 
          v-model:selectedStatus="selectedStatus"
          v-model:selectedCategory="selectedCategory"
          v-model:selectedBuilding="selectedBuilding"
          v-model:selectedSort="selectedSort"
          v-model:viewMode="viewMode"
          :currentLang="currentLang"
          :t="t"
        />

        <!-- Search Results Count -->
        <div class="mb-4 flex items-center justify-between text-xs font-semibold text-brand-latte">
          <span>{{ isTh ? `แสดง ${filteredItems.length} รายการ` : `Showing ${filteredItems.length} items` }}</span>
          <button v-if="searchQuery || selectedCategory || selectedBuilding || selectedStatus !== 'all'" @click="resetFilters" class="text-brand-chestnut hover:underline">
            {{ t('btnResetFilters') }}
          </button>
        </div>

        <!-- Items Container -->
        <div v-if="filteredItems.length === 0" class="py-16 text-center bg-brand-cream/30 rounded-3xl border border-brand-sand/70 p-6">
          <p class="text-sm font-semibold text-brand-latte mb-3">{{ t('noItemsFound') }}</p>
          <button 
            @click="resetFilters"
            class="px-4 py-2 rounded-xl bg-brand-sand text-brand-chestnut text-xs font-bold"
          >
            {{ t('btnResetFilters') }}
          </button>
        </div>

        <div 
          v-else 
          :class="viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-3'"
        >
          <ItemCard 
            v-for="item in filteredItems" 
            :key="item.id"
            :item="item"
            :viewMode="viewMode"
            :currentLang="currentLang"
            :t="t"
            @select-item="openItemDetail"
          />
        </div>
      </div>

      <!-- TAB: MY REPORTS TRACKER -->
      <div v-else-if="activeTab === 'my-posts'" class="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MyItemsTracker 
          :myItems="myItems"
          :currentLang="currentLang"
          :t="t"
          @open-report="openReportModal"
          @select-item="openItemDetail"
          @mark-returned="markItemReturned"
        />
      </div>

      <!-- TAB: LOCATIONS DIRECTORY -->
      <div v-else-if="activeTab === 'locations'">
        <CampusHandoverSection :currentLang="currentLang" :t="t" />
      </div>

    </main>

    <!-- Footer -->
    <footer class="bg-brand-cream/80 border-t border-brand-sand py-10 mt-16 text-xs text-brand-mocha">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="font-bold text-sm text-brand-espresso">LostStuff<span class="text-brand-caramel">2</span></span>
            <span class="px-2 py-0.5 rounded-full text-[10px] bg-brand-sand font-bold text-brand-chestnut">v1.0 Demo</span>
          </div>
          <p class="text-brand-latte">{{ t('footerDesc') }}</p>
        </div>

        <div class="flex items-center gap-4">
          <button 
            @click="resetDemoData"
            class="px-3.5 py-1.5 rounded-xl bg-brand-sand/70 hover:bg-brand-sand text-brand-chestnut font-bold text-xs border border-brand-tan/50 transition-colors flex items-center gap-1.5"
            :title="t('navResetData')"
          >
            <RotateCcw class="w-3.5 h-3.5" />
            <span>{{ t('navResetData') }}</span>
          </button>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-6 border-t border-brand-sand/50 text-center text-[11px] text-brand-latte">
        {{ t('footerCopyright') }}
      </div>
    </footer>

    <!-- MODALS -->

    <!-- 1. Report Modal (Lost / Found) -->
    <ReportModal 
      v-if="isReportModalOpen"
      :reportType="activeReportType"
      :currentLang="currentLang"
      :t="t"
      @close="isReportModalOpen = false"
      @submit-report="handleReportSubmitted"
    />

    <!-- 2. Match Alert Modal -->
    <MatchAlertModal 
      v-if="isMatchAlertOpen && activeMatchData"
      :sourceItem="activeMatchSourceItem"
      :matchData="activeMatchData"
      :currentLang="currentLang"
      :t="t"
      @close="isMatchAlertOpen = false"
      @verify-claim="handleVerifyClaimFromAlert"
    />

    <!-- 3. Item Detail Modal -->
    <ItemDetailModal 
      v-if="selectedItem"
      :item="selectedItem"
      :currentLang="currentLang"
      :t="t"
      @close="selectedItem = null"
      @mark-returned="markItemReturned"
      @claim-item="handleClaimItem"
    />

    <!-- Toast Notifications Container -->
    <ToastNotification :toasts="toasts" @dismiss="dismissToast" />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  FileText, Cpu, ShieldCheck, ArrowRight, RotateCcw 
} from 'lucide-vue-next'

import Navbar from './components/Navbar.vue'
import HeroBanner from './components/HeroBanner.vue'
import FilterSidebar from './components/FilterSidebar.vue'
import ItemCard from './components/ItemCard.vue'
import ItemDetailModal from './components/ItemDetailModal.vue'
import ReportModal from './components/ReportModal.vue'
import MatchAlertModal from './components/MatchAlertModal.vue'
import CampusHandoverSection from './components/CampusHandoverSection.vue'
import FaqSection from './components/FaqSection.vue'
import MyItemsTracker from './components/MyItemsTracker.vue'
import ToastNotification from './components/ToastNotification.vue'

import { initialMockItems } from './data/mockItems'
import { translations } from './data/i18n'
import { findMatches } from './utils/matchingEngine'

// App State
const currentLang = ref('th')
const activeTab = ref('home')
const items = ref([])
const notifications = ref([])

// Filters
const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedCategory = ref('')
const selectedBuilding = ref('')
const selectedSort = ref('newest')
const viewMode = ref('grid')

// Modals
const isReportModalOpen = ref(false)
const activeReportType = ref('lost')
const selectedItem = ref(null)

const isMatchAlertOpen = ref(false)
const activeMatchSourceItem = ref(null)
const activeMatchData = ref(null)

// i18n Translation Helper
function t(key) {
  const dict = translations[currentLang.value] || translations['th']
  return dict[key] || key
}

const isTh = computed(() => currentLang.value === 'th')

// Storage Persistence Key
const STORAGE_KEY = 'loststuff2_items_v1'
const NOTIFS_KEY = 'loststuff2_notifs_v1'

// Toasts State
const toasts = ref([])

function showToast({ title, message, type = 'info', duration = 4500 }) {
  const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
  toasts.value.push({ id, title, message, type })

  if (duration > 0) {
    setTimeout(() => {
      dismissToast(id)
    }, duration)
  }
}

function dismissToast(id) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

// Global Keyboard Shortcuts
function handleKeydown(e) {
  // Focus Search on "/" or "Ctrl+K" when not in input
  if (
    (e.key === '/' || (e.ctrlKey && e.key.toLowerCase() === 'k')) &&
    !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
  ) {
    e.preventDefault()
    if (activeTab.value !== 'home' && activeTab.value !== 'search') {
      activeTab.value = 'home'
    }
    setTimeout(() => {
      const searchInput = document.getElementById('hero-search-input')
      if (searchInput) {
        searchInput.focus()
        searchInput.select()
      }
    }, 50)
  }

  // Dismiss modals on Escape
  if (e.key === 'Escape') {
    if (isReportModalOpen.value) isReportModalOpen.value = false
    if (isMatchAlertOpen.value) isMatchAlertOpen.value = false
    if (selectedItem.value) selectedItem.value = null
  }
}

onMounted(() => {
  loadData()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

function loadData() {
  const savedItems = localStorage.getItem(STORAGE_KEY)
  if (savedItems) {
    try {
      items.value = JSON.parse(savedItems)
    } catch (e) {
      items.value = [...initialMockItems]
    }
  } else {
    items.value = [...initialMockItems]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
  }

  const savedNotifs = localStorage.getItem(NOTIFS_KEY)
  if (savedNotifs) {
    try {
      notifications.value = JSON.parse(savedNotifs)
    } catch (e) {
      notifications.value = []
    }
  } else {
    // Initial mock notification for AirPods match
    const airpods = items.value.find(i => i.id === 'item-003')
    if (airpods) {
      notifications.value = [
        {
          id: 'notif-1',
          timeAgo: '15m ago',
          matchScore: 85,
          matchedItem: airpods
        }
      ]
    }
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
  localStorage.setItem(NOTIFS_KEY, JSON.stringify(notifications.value))
}

function resetDemoData() {
  if (confirm(t('demoResetConfirm'))) {
    items.value = [...initialMockItems]
    notifications.value = [
      {
        id: 'notif-1',
        timeAgo: '15m ago',
        matchScore: 85,
        matchedItem: initialMockItems[2]
      }
    ]
    saveData()
    showToast({
      title: isTh.value ? 'รีเซ็ตข้อมูลแล้ว' : 'Data Reset',
      message: isTh.value ? 'คืนค่าข้อมูลตัวอย่างในมหาวิทยาลัยเรียบร้อย' : 'Restored default campus mock items.',
      type: 'info'
    })
  }
}

// Counts & Computed Items
const myItems = computed(() => items.value.filter(item => item.isMyPost))
const activeLostCount = computed(() => items.value.filter(item => item.type === 'lost' && item.status === 'searching').length)

const filteredItems = computed(() => {
  let result = [...items.value]

  // Status Filter
  if (selectedStatus.value === 'lost') {
    result = result.filter(item => item.type === 'lost' && item.status !== 'returned')
  } else if (selectedStatus.value === 'found') {
    result = result.filter(item => item.type === 'found' && item.status !== 'returned')
  } else if (selectedStatus.value === 'returned') {
    result = result.filter(item => item.status === 'returned')
  }

  // Category Filter
  if (selectedCategory.value) {
    result = result.filter(item => item.category === selectedCategory.value)
  }

  // Campus Building Filter
  if (selectedBuilding.value) {
    result = result.filter(item => item.buildingId === selectedBuilding.value)
  }

  // Keyword Search
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    result = result.filter(item => 
      (item.titleTh && item.titleTh.toLowerCase().includes(q)) ||
      (item.titleEn && item.titleEn.toLowerCase().includes(q)) ||
      (item.descriptionTh && item.descriptionTh.toLowerCase().includes(q)) ||
      (item.descriptionEn && item.descriptionEn.toLowerCase().includes(q)) ||
      (item.locationDetailTh && item.locationDetailTh.toLowerCase().includes(q)) ||
      (item.locationDetailEn && item.locationDetailEn.toLowerCase().includes(q))
    )
  }

  // Sorting
  if (selectedSort.value === 'newest') {
    result.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
  }

  return result
})

// Navigation Handlers
function handleNavChange(tab) {
  activeTab.value = tab
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleLangChange(lang) {
  currentLang.value = lang
}

function resetFilters() {
  searchQuery.value = ''
  selectedStatus.value = 'all'
  selectedCategory.value = ''
  selectedBuilding.value = ''
  selectedSort.value = 'newest'
}

function openReportModal(type = 'lost') {
  activeReportType.value = type
  isReportModalOpen.value = true
}

function openItemDetail(item) {
  selectedItem.value = item
}

function markItemReturned(itemId) {
  const target = items.value.find(i => i.id === itemId)
  if (target) {
    target.status = 'returned'
    saveData()
    showToast({
      title: isTh.value ? 'อัปเดตสถานะสำเร็จ' : 'Status Updated',
      message: isTh.value ? 'เปลี่ยนสถานะเป็น "ส่งมอบคืนแล้ว" เรียบร้อย' : 'Item marked as returned.',
      type: 'success'
    })
  }
}

// Report Submission & Real-time Matching Trigger
function handleReportSubmitted(newItem) {
  items.value.unshift(newItem)
  saveData()
  isReportModalOpen.value = false

  // Trigger matching engine
  const matches = findMatches(newItem, items.value)

  if (matches.length > 0 && matches[0].totalScore >= 50) {
    const bestMatch = matches[0]
    
    // Add to notifications
    notifications.value.unshift({
      id: `notif-${Date.now()}`,
      timeAgo: 'Just now',
      matchScore: bestMatch.totalScore,
      matchedItem: bestMatch.candidate
    })
    saveData()

    // If high confidence (>= 60%), pop up the instant Match Alert Modal
    if (bestMatch.totalScore >= 60) {
      activeMatchSourceItem.value = newItem
      activeMatchData.value = bestMatch
      isMatchAlertOpen.value = true
    } else {
      showToast({
        title: isTh.value ? 'ตรวจพบรายการที่อาจตรงกัน' : 'Potential Match Found',
        message: isTh.value ? `พบรายการที่ตรงกัน ${bestMatch.totalScore}% ในระบบ` : `Found ${bestMatch.totalScore}% matching item.`,
        type: 'match'
      })
    }
  } else {
    showToast({
      title: isTh.value ? 'โพสต์แจ้งสำเร็จ!' : 'Report Submitted!',
      message: isTh.value ? 'ระบบกำลังช่วยติดตามหาและจะแจ้งเตือนทันทีเมื่อพบรายการที่ตรงกัน' : 'The matching engine is monitoring records and will notify you upon matches.',
      type: 'success'
    })
  }
}

function handleClaimItem(item) {
  showToast({
    title: isTh.value ? 'บันทึกคำขอยืนยันสิทธิ์แล้ว' : 'Claim Request Sent',
    message: isTh.value 
      ? `กรุณาติดต่อที่ "${item.handoverPointTh}" หรือ LINE: ${item.reporterContact}`
      : `Please proceed to "${item.handoverPointEn}" or contact: ${item.reporterContact}`,
    type: 'success',
    duration: 8000
  })
}

function handleVerifyClaimFromAlert(candidateItem) {
  isMatchAlertOpen.value = false
  openItemDetail(candidateItem)
}

function handleViewMatchNotification(notif) {
  openItemDetail(notif.matchedItem)
}

function clearNotifications() {
  notifications.value = []
  saveData()
  showToast({
    title: isTh.value ? 'ล้างการแจ้งเตือนแล้ว' : 'Notifications Cleared',
    message: isTh.value ? 'ลบรายการแจ้งเตือนทั้งหมดเรียบร้อย' : 'All notifications cleared.',
    type: 'info'
  })
}
</script>
