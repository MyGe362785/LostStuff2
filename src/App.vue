<template>
  <div class="min-h-screen flex flex-col bg-brand-paper text-brand-espresso">
    
    <!-- ADMIN VIEW: RENDERED WHEN PATH IS /admin -->
    <div v-if="isAdminRoute" class="flex-1 flex flex-col">
      <AdminPortal
        :items="items"
        :auditLogs="auditLogs"
        :currentLang="currentLang"
        :t="t"
        @navigate-home="navigateTo('/')"
        @lang-change="handleLangChange"
        @approve-item="handleApproveItem"
        @reject-item="handleRejectItem"
        @confirm-return="handleStaffConfirmReturn"
        @reset-data="resetDemoData"
      />
    </div>

    <!-- STUDENT PUBLIC VIEW: RENDERED FOR ALL PUBLIC ROUTES -->
    <div v-else class="flex-1 flex flex-col">
      
      <!-- Public Navbar (No Bell, No Staff/Eval buttons, Email Mailbox as primary) -->
      <Navbar 
        :activeTab="activeTab"
        :currentLang="currentLang"
        :myReportsCount="myItems.length"
        :emailsCount="unreadEmailsCount"
        :user="currentUser"
        :backendConfigured="isBackendConfigured"
        :t="t"
        @nav-change="handleNavChange"
        @lang-change="handleLangChange"
        @open-report="openReportModal"
        @open-emails="isEmailModalOpen = true"
        @sign-in="isAuthModalOpen = true"
        @sign-out="signOut"
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
              v-model:selectedColor="selectedColor"
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
            v-model:selectedColor="selectedColor"
            v-model:selectedBuilding="selectedBuilding"
            v-model:selectedSort="selectedSort"
            v-model:viewMode="viewMode"
            :currentLang="currentLang"
            :t="t"
          />

          <!-- Search Results Count -->
          <div class="mb-4 flex items-center justify-between text-xs font-semibold text-brand-latte">
            <span>{{ isTh ? `แสดง ${filteredItems.length} รายการ` : `Showing ${filteredItems.length} items` }}</span>
            <button v-if="searchQuery || selectedCategory || selectedColor || selectedBuilding || selectedStatus !== 'all'" @click="resetFilters" class="text-brand-chestnut hover:underline">
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
            :allowStatusChanges="!isBackendConfigured"
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

      <!-- Public Footer -->
      <footer class="bg-brand-cream/80 border-t border-brand-sand py-10 mt-16 text-xs text-brand-mocha">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="font-bold text-sm text-brand-espresso">LostStuff<span class="text-brand-caramel">2</span></span>
              <span class="px-2 py-0.5 rounded-full text-[10px] bg-brand-sand font-bold text-brand-chestnut">v2.0</span>
            </div>
            <p class="text-brand-latte">{{ t('footerDesc') }}</p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <!-- Discrete link to /admin -->
            <button
              @click="navigateTo('/admin')"
              class="px-3 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck class="w-3.5 h-3.5 text-stone-700" />
              <span>{{ isTh ? 'เข้าสู่ระบบเจ้าหน้าที่ (/admin)' : 'Staff Portal (/admin)' }}</span>
            </button>

            <!-- Reset Demo Data -->
            <button 
              @click="resetDemoData"
              class="px-3 py-1.5 rounded-lg bg-brand-sand/70 hover:bg-brand-sand text-brand-chestnut font-bold text-xs border border-brand-tan/50 transition-colors flex items-center gap-1.5"
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

    </div>

    <!-- MODALS -->

    <!-- 1. Report Modal (Lost / Found) with 5-Factor attributes -->
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
      :backendConfigured="isBackendConfigured"
      @close="selectedItem = null"
      @mark-returned="markItemReturned"
      @approve-item="handleApproveItem"
      @claim-item="handleClaimItem"
    />

    <!-- 4. Ownership Claim Modal (Proposal Use-Case) -->
    <ClaimModal
      v-if="isClaimModalOpen && claimingTargetItem"
      :item="claimingTargetItem"
      :currentLang="currentLang"
      :t="t"
      @close="isClaimModalOpen = false"
      @submit-claim="handleSubmitClaim"
    />

    <!-- 5. Simulated Email Mailbox Drawer (Primary Notification Center) -->
    <EmailInboxModal
      v-if="isEmailModalOpen"
      :emails="emails"
      :currentLang="currentLang"
      :t="t"
      @close="isEmailModalOpen = false"
      @clear-emails="clearEmails"
    />

    <AuthModal
      v-if="isAuthModalOpen && isBackendConfigured"
      :currentLang="currentLang"
      @close="isAuthModalOpen = false"
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

// Admin & Claim & Email components
import AdminPortal from './components/AdminPortal.vue'
import ClaimModal from './components/ClaimModal.vue'
import EmailInboxModal from './components/EmailInboxModal.vue'
import AuthModal from './components/AuthModal.vue'

import { initialMockItems } from './data/mockItems'
import { initialAuditLogs } from './data/auditLogs'
import { translations } from './data/i18n'
import { findMatches } from './utils/matchingEngine'
import { loadEmails, saveEmails, dispatchEmail, resetEmails } from './utils/emailNotifier'
import { isBackendConfigured, supabase } from './lib/supabase'
import { createClaim, createItem, getCurrentProfile, getCurrentUser, listVisibleItems, updateItemStatus } from './services/lostFoundRepository'

// Routing State
const currentPath = ref(window.location.pathname || '/')
const isAdminRoute = computed(() => {
  if (isBackendConfigured) return ['staff', 'admin'].includes(currentProfile.value?.role)
  return currentPath.value === '/admin' || 
         currentPath.value.startsWith('/admin') || 
         window.location.hash === '#/admin' ||
         window.location.search.includes('admin')
})

function navigateTo(path) {
  currentPath.value = path
  window.history.pushState(null, '', path)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// App State
const currentLang = ref('th')
const activeTab = ref('home')
const items = ref([])
const auditLogs = ref([])
const emails = ref([])
const currentUser = ref(null)
const currentProfile = ref(null)

// Filters
const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedCategory = ref('')
const selectedColor = ref('')
const selectedBuilding = ref('')
const selectedSort = ref('newest')
const viewMode = ref('grid')

// Modals State
const isReportModalOpen = ref(false)
const activeReportType = ref('lost')
const selectedItem = ref(null)

const isMatchAlertOpen = ref(false)
const activeMatchSourceItem = ref(null)
const activeMatchData = ref(null)

const isClaimModalOpen = ref(false)
const claimingTargetItem = ref(null)
const isEmailModalOpen = ref(false)
const isAuthModalOpen = ref(false)

// i18n Translation Helper
function t(key) {
  const dict = translations[currentLang.value] || translations['th']
  return dict[key] || key
}

const isTh = computed(() => currentLang.value === 'th')

// Storage Persistence Keys
const STORAGE_KEY = 'loststuff2_items_v2'
const AUDIT_KEY = 'loststuff2_audit_v2'

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

// Global Keyboard & Navigation Listeners
function handlePopState() {
  currentPath.value = window.location.pathname
}

function handleKeydown(e) {
  if (
    (e.key === '/' || (e.ctrlKey && e.key.toLowerCase() === 'k')) &&
    !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
  ) {
    if (!isAdminRoute.value) {
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
  }

  // Dismiss modals on Escape
  if (e.key === 'Escape') {
    if (isReportModalOpen.value) isReportModalOpen.value = false
    if (isMatchAlertOpen.value) isMatchAlertOpen.value = false
    if (selectedItem.value) selectedItem.value = null
    if (isClaimModalOpen.value) isClaimModalOpen.value = false
    if (isEmailModalOpen.value) isEmailModalOpen.value = false
  }
}

onMounted(async () => {
  await loadData()
  if (isBackendConfigured) {
    supabase.auth.onAuthStateChange((_event, session) => {
      currentUser.value = session?.user || null
      void refreshCurrentProfile().catch((error) => {
        console.error('Unable to refresh user profile', error)
      })
      if (session?.user) isAuthModalOpen.value = false
      void loadBackendItems().catch((error) => {
        console.error('Unable to refresh Supabase data', error)
        showToast({ title: isTh.value ? 'รีเฟรชข้อมูลไม่สำเร็จ' : 'Could not refresh data', message: error.message, type: 'info' })
      })
    })
  }
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('popstate', handlePopState)
  window.addEventListener('hashchange', handlePopState)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('popstate', handlePopState)
  window.removeEventListener('hashchange', handlePopState)
})

async function loadData() {
  if (isBackendConfigured) {
    try {
      currentUser.value = await getCurrentUser()
      currentProfile.value = await getCurrentProfile()
      await loadBackendItems()
      auditLogs.value = []
      emails.value = []
      return
    } catch (error) {
      console.error('Unable to load Supabase data', error)
      showToast({ title: isTh.value ? 'เชื่อมต่อข้อมูลไม่สำเร็จ' : 'Could not load data', message: error.message, type: 'info' })
    }
  }
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

  const savedAudit = localStorage.getItem(AUDIT_KEY)
  if (savedAudit) {
    try {
      auditLogs.value = JSON.parse(savedAudit)
    } catch (e) {
      auditLogs.value = [...initialAuditLogs]
    }
  } else {
    auditLogs.value = [...initialAuditLogs]
    localStorage.setItem(AUDIT_KEY, JSON.stringify(auditLogs.value))
  }

  emails.value = loadEmails()
}

async function loadBackendItems() {
  if (!isBackendConfigured) return
  items.value = await listVisibleItems()
}

async function refreshCurrentProfile() {
  currentProfile.value = currentUser.value ? await getCurrentProfile() : null
}

async function signOut() {
  await supabase.auth.signOut()
  currentUser.value = null
  currentProfile.value = null
  await loadBackendItems()
  showToast({ title: isTh.value ? 'ออกจากระบบแล้ว' : 'Signed out', message: isTh.value ? 'คุณสามารถดูรายการสาธารณะได้ตามปกติ' : 'Public listings remain available.', type: 'success' })
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
  localStorage.setItem(AUDIT_KEY, JSON.stringify(auditLogs.value))
}

function resetDemoData() {
  // 1. Deep clone items and audit logs
  items.value = JSON.parse(JSON.stringify(initialMockItems))
  auditLogs.value = JSON.parse(JSON.stringify(initialAuditLogs))
  
  // 2. Save items & audit logs to localStorage
  saveData()
  
  // 3. Reset simulated emails to fresh initial state in localStorage
  emails.value = resetEmails()
  
  // 4. Clear any saved ownership claims in localStorage
  localStorage.removeItem('loststuff2_claims')
  
  // 5. Reset all search & filter states
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedColor.value = ''
  selectedBuilding.value = ''
  selectedStatus.value = 'all'
  selectedSort.value = 'newest'
  
  // 6. Dismiss any open modals
  isReportModalOpen.value = false
  isMatchAlertOpen.value = false
  selectedItem.value = null
  isClaimModalOpen.value = false
  isEmailModalOpen.value = false

  showToast({
    title: isTh.value ? 'รีเซ็ตข้อมูลทุกอย่างสำเร็จ' : 'All Data Reset',
    message: isTh.value 
      ? 'คืนค่าข้อมูลสิ่งของ (12 รายการ), อีเมลแจ้งเตือน, Audit Log และตัวกรองทั้งหมดกลับสู่ค่าเริ่มต้นเรียบร้อย' 
      : 'Restored mock items (12 items), emails, audit logs, and filters to initial state.',
    type: 'success'
  })
}

// Counts & Computed Items
const myItems = computed(() => items.value.filter(item => item.isMyPost))
const activeLostCount = computed(() => items.value.filter(item => item.type === 'lost' && (item.status === 'searching' || item.status === 'pending_review')).length)
const unreadEmailsCount = computed(() => emails.value.filter(e => !e.isRead).length)

const filteredItems = computed(() => {
  let result = [...items.value]

  // Status Filter
  if (selectedStatus.value === 'lost') {
    result = result.filter(item => item.type === 'lost' && item.status !== 'returned' && item.status !== 'closed')
  } else if (selectedStatus.value === 'found') {
    result = result.filter(item => item.type === 'found' && item.status !== 'returned' && item.status !== 'closed')
  } else if (selectedStatus.value === 'returned') {
    result = result.filter(item => item.status === 'returned')
  } else if (selectedStatus.value !== 'all') {
    result = result.filter(item => item.status === selectedStatus.value)
  }

  // Category Filter
  if (selectedCategory.value) {
    result = result.filter(item => item.category === selectedCategory.value)
  }

  // Color Filter
  if (selectedColor.value) {
    result = result.filter(item => {
      const colorVal = (item.color || item.colorNameTh || item.colorNameEn || '').toLowerCase()
      return colorVal.includes(selectedColor.value.toLowerCase())
    })
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
      (item.colorNameTh && item.colorNameTh.toLowerCase().includes(q)) ||
      (item.brand && item.brand.toLowerCase().includes(q)) ||
      (item.distinctiveMarks && item.distinctiveMarks.toLowerCase().includes(q)) ||
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
  selectedColor.value = ''
  selectedBuilding.value = ''
  selectedSort.value = 'newest'
}

function openReportModal(type = 'lost') {
  if (isBackendConfigured && !currentUser.value) {
    isAuthModalOpen.value = true
    showToast({ title: isTh.value ? 'กรุณาเข้าสู่ระบบก่อน' : 'Sign in required', message: isTh.value ? 'เข้าสู่ระบบก่อนแจ้งรายการใหม่' : 'Please sign in before creating a report.', type: 'info' })
    return
  }
  activeReportType.value = type
  isReportModalOpen.value = true
}

function openItemDetail(item) {
  selectedItem.value = item
}

// Staff & Status Actions
async function markItemReturned(itemId) {
  if (isBackendConfigured) {
    try {
      await updateItemStatus(itemId, 'returned', 'return_confirmed')
      await loadBackendItems()
    } catch (error) {
      showToast({ title: 'Could not update item', message: error.message, type: 'info' })
    }
    return
  }
  const target = items.value.find(i => i.id === itemId)
  if (target) {
    target.status = 'returned'
    
    // Add audit log
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      staffName: 'ผู้ใช้งาน / เจ้าของรายการ',
      actionType: 'return_confirmed',
      actionLabelTh: 'ส่งมอบคืนสำเร็จ',
      actionLabelEn: 'Returned',
      itemId: target.id,
      itemTitle: target.titleTh,
      claimantInfo: target.reporterName,
      notes: 'ผู้ใช้ยืนยันการรับมอบคืนสิ่งของเรียบร้อย',
      statusBadgeClass: 'bg-green-100 text-green-800 border-green-200'
    }
    auditLogs.value.unshift(newLog)
    saveData()

    showToast({
      title: isTh.value ? 'อัปเดตสถานะสำเร็จ' : 'Status Updated',
      message: isTh.value ? 'เปลี่ยนสถานะเป็น "ส่งมอบคืนแล้ว" เรียบร้อย' : 'Item marked as returned.',
      type: 'success'
    })
  }
}

async function handleApproveItem(itemId) {
  if (isBackendConfigured) {
    try {
      await updateItemStatus(itemId, 'searching', 'item_approved')
      await loadBackendItems()
      showToast({ title: isTh.value ? 'อนุมัติรายการแล้ว' : 'Item approved', message: isTh.value ? 'รายการเผยแพร่แล้ว' : 'The item is now published.', type: 'success' })
    } catch (error) {
      showToast({ title: 'Could not approve item', message: error.message, type: 'info' })
    }
    return
  }
  const target = items.value.find(i => i.id === itemId)
  if (target) {
    target.status = 'searching'
    
    // Add audit log
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      staffName: 'เจ้าหน้าที่ศูนย์ประสานงาน (Staff)',
      actionType: 'approve_item',
      actionLabelTh: 'อนุมัติรายการขึ้นสู่ระบบ',
      actionLabelEn: 'Item Approved',
      itemId: target.id,
      itemTitle: target.titleTh,
      claimantInfo: target.reporterName,
      notes: 'เจ้าหน้าที่ตรวจสอบความครบถ้วนของข้อมูลและอนุมัติขึ้นสู่ระบบสาธารณะ',
      statusBadgeClass: 'bg-blue-100 text-blue-800 border-blue-200'
    }
    auditLogs.value.unshift(newLog)
    saveData()

    // Dispatch simulated email notification
    const newEmail = dispatchEmail({
      to: `${target.reporterName}@univ.ac.th`,
      toName: target.reporterName,
      subject: `[LostStuff] รายการของคุณได้รับการอนุมัติแล้ว (#${target.id} ${target.titleTh})`,
      previewText: `เจ้าหน้าที่ได้ตรวจสอบและอนุมัติรายการของท่านขึ้นสู่ระบบค้นหาของมหาวิทยาลัยแล้ว...`,
      bodyHtmlTh: `
        <div style="font-family: sans-serif; color: #2D2016;">
          <h3 style="color: #15803D;">รายการของคุณได้รับการอนุมัติแล้ว</h3>
          <p>เรียน คุณ${target.reporterName},</p>
          <p>เจ้าหน้าที่ได้ตรวจสอบข้อมูลรายการ <strong>"${target.titleTh}"</strong> เรียบร้อยแล้ว ขณะนี้รายการได้ถูกเผยแพร่ในคลังค้นหาของหายของมหาวิทยาลัย</p>
          <p>ท่านจะได้รับการแจ้งเตือนทางอีเมลทันทีเมื่อระบบตรวจพบคู่ตรงในระบบ</p>
        </div>
      `,
      badgeType: 'approve'
    })
    emails.value.unshift(newEmail)

    showToast({
      title: isTh.value ? 'อนุมัติรายการแล้ว' : 'Item Approved',
      message: isTh.value ? `รายการ #${target.id} เปิดใช้งานในระบบสาธารณะเรียบร้อย (ส่งอีเมลแจ้งแล้ว)` : `Item #${target.id} is now active (email dispatched).`,
      type: 'success'
    })
  }
}

async function handleRejectItem(itemId) {
  if (isBackendConfigured) {
    try {
      await updateItemStatus(itemId, 'closed', 'item_closed')
      await loadBackendItems()
    } catch (error) {
      showToast({ title: 'Could not close item', message: error.message, type: 'info' })
    }
    return
  }
  const target = items.value.find(i => i.id === itemId)
  if (target) {
    target.status = 'closed'

    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      staffName: 'เจ้าหน้าที่ศูนย์ประสานงาน (Staff)',
      actionType: 'reject_item',
      actionLabelTh: 'ไม่อนุมัติ / ปิดเคส',
      actionLabelEn: 'Rejected / Closed',
      itemId: target.id,
      itemTitle: target.titleTh,
      claimantInfo: target.reporterName,
      notes: 'ข้อมูลไม่ครบถ้วนหรือซ้ำซ้อน เจ้าหน้าที่ปิดเคส',
      statusBadgeClass: 'bg-red-100 text-red-800 border-red-200'
    }
    auditLogs.value.unshift(newLog)
    saveData()

    showToast({
      title: isTh.value ? 'ปิดรายการแล้ว' : 'Case Closed',
      message: isTh.value ? `รายการ #${target.id} ถูกปรับสถานะเป็นปิดรายการ` : `Item #${target.id} marked as closed.`,
      type: 'info'
    })
  }
}

async function handleStaffConfirmReturn({ itemId, itemTitle, claimant, notes }) {
  if (isBackendConfigured) {
    try {
      await updateItemStatus(itemId, 'returned', 'return_confirmed')
      await loadBackendItems()
    } catch (error) {
      showToast({ title: 'Could not confirm return', message: error.message, type: 'info' })
    }
    return
  }
  const target = items.value.find(i => i.id === itemId)
  if (target) {
    target.status = 'returned'

    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      staffName: 'เจ้าหน้าที่ ณ จุดส่งมอบทางการ',
      actionType: 'return_confirmed',
      actionLabelTh: 'ยืนยันการส่งมอบคืนสำเร็จ',
      actionLabelEn: 'Handover Return Confirmed',
      itemId: target.id,
      itemTitle: itemTitle || target.titleTh,
      claimantInfo: claimant,
      notes: notes,
      statusBadgeClass: 'bg-green-100 text-green-800 border-green-200'
    }
    auditLogs.value.unshift(newLog)
    saveData()

    // Dispatch simulated return email
    const newEmail = dispatchEmail({
      to: `${claimant}@univ.ac.th`,
      toName: claimant,
      subject: `[LostStuff] ยืนยันการส่งมอบคืนสิ่งของสำเร็จ (#${target.id})`,
      previewText: `เจ้าหน้าที่ได้บันทึกการส่งมอบคืน ${target.titleTh} แก่ท่านเรียบร้อยแล้ว...`,
      bodyHtmlTh: `
        <div style="font-family: sans-serif; color: #2D2016;">
          <h3 style="color: #15803D;">การส่งมอบคืนสิ่งของสำเร็จ</h3>
          <p>เรียน คุณ${claimant},</p>
          <p>เจ้าหน้าที่ประจำจุดบริการได้รับรองการส่งมอบคืน <strong>"${target.titleTh}"</strong> ให้แก่ท่านเรียบร้อยแล้ว</p>
          <p><strong>บันทึกการตรวจสอบ:</strong> ${notes}</p>
          <p>ระบบได้เปลี่ยนสถานะเป็น "ส่งคืนแล้ว" และบันทึกประวัติการดำเนินงาน (Audit Log) เรียบร้อย</p>
        </div>
      `,
      badgeType: 'return'
    })
    emails.value.unshift(newEmail)

    showToast({
      title: isTh.value ? 'บันทึกการส่งมอบสำเร็จ' : 'Return Confirmed',
      message: isTh.value ? `ส่งคืนสิ่งของ บันทึก Audit Log และส่งอีเมลยืนยันแล้ว` : 'Return recorded, audited, and email dispatched.',
      type: 'success'
    })
  }
}

// Ownership Claim Flow Handlers
function handleClaimItem(item) {
  if (isBackendConfigured && !currentUser.value) {
    isAuthModalOpen.value = true
    return
  }
  claimingTargetItem.value = item
  isClaimModalOpen.value = true
}

async function handleSubmitClaim(claimData) {
  if (isBackendConfigured) {
    try {
      await createClaim({ itemId: claimData.itemId, proof: `${claimData.secretDetails}\nStudent ID: ${claimData.claimantId}`, preferredContact: claimData.claimantContact })
      isClaimModalOpen.value = false
      showToast({ title: isTh.value ? 'ยื่นคำขอสำเร็จ' : 'Claim submitted', message: isTh.value ? 'เจ้าหน้าที่จะตรวจสอบหลักฐานของคุณ' : 'Staff will review your proof.', type: 'success' })
    } catch (error) {
      showToast({ title: isTh.value ? 'ส่งคำขอไม่สำเร็จ' : 'Could not submit claim', message: error.message, type: 'info' })
    }
    return
  }
  const target = items.value.find(i => i.id === claimData.itemId)
  if (target) {
    target.status = 'pending_confirm'

    // Add Audit Log
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      staffName: 'ระบบอัตโนมัติ (Verification Queue)',
      actionType: 'claim_received',
      actionLabelTh: 'รับเรื่องยื่นขอรับคืน (รอยืนยัน)',
      actionLabelEn: 'Claim Received',
      itemId: target.id,
      itemTitle: target.titleTh,
      claimantInfo: `${claimData.claimantName} (${claimData.claimantId})`,
      notes: `ยื่นหลักฐาน/ตำหนิลับ: "${claimData.secretDetails}" • ติดต่อ: ${claimData.claimantContact}`,
      statusBadgeClass: 'bg-purple-100 text-purple-800 border-purple-200'
    }
    auditLogs.value.unshift(newLog)
    saveData()

    // Dispatch simulated email to student
    const newEmail = dispatchEmail({
      to: `${claimData.claimantId}@univ.ac.th`,
      toName: claimData.claimantName,
      subject: `[LostStuff] ได้รับคำขอยื่นยืนยันความเป็นเจ้าของแล้ว (#${target.id})`,
      previewText: `ระบบได้รับข้อมูลหลักฐานยืนยันสิ่งของ "${target.titleTh}" ของท่านเรียบร้อยแล้ว...`,
      bodyHtmlTh: `
        <div style="font-family: sans-serif; color: #2D2016;">
          <h3 style="color: #784D34;">ได้รับคำขอยื่นยืนยันความเป็นเจ้าของแล้ว</h3>
          <p>เรียน คุณ${claimData.claimantName},</p>
          <p>ระบบได้รับคำร้องยืนยันความเป็นเจ้าของสำหรับ <strong>"${target.titleTh}"</strong> แล้ว</p>
          <p>ข้อมูลตำหนิเฉพาะและหลักฐานของท่านถูกส่งต่อไปยังเจ้าหน้าที่ผู้ดูแล เพื่อตรวจสอบความถูกต้องก่อนดำเนินการนัดหมายรับมอบของ ณ <strong>${target.handoverPointTh}</strong></p>
        </div>
      `,
      badgeType: 'claim'
    })
    emails.value.unshift(newEmail)

    showToast({
      title: isTh.value ? 'ยื่นหลักฐานขอรับคืนสำเร็จ' : 'Claim Submitted',
      message: isTh.value 
        ? 'ระบบได้ปรับสถานะเป็น "รอยืนยัน" และส่งอีเมลยืนยันการรับเรื่องแล้ว'
        : 'Status set to Pending Confirmation. Confirmation email dispatched.',
      type: 'success',
      duration: 6000
    })
  }
}

// Report Submission & Real-time 5-Factor Matching Trigger (Email as primary notification)
async function handleReportSubmitted(newItem) {
  if (isBackendConfigured) {
    try {
      await createItem({ item: newItem, imageFile: newItem.imageFile })
      await loadBackendItems()
      isReportModalOpen.value = false
      showToast({ title: isTh.value ? 'ส่งรายการแล้ว' : 'Report submitted', message: isTh.value ? 'รายการเข้าสู่คิวตรวจสอบแล้ว' : 'Your report is now awaiting review.', type: 'success' })
    } catch (error) {
      showToast({ title: isTh.value ? 'ส่งรายการไม่สำเร็จ' : 'Could not submit report', message: error.message, type: 'info' })
    }
    return
  }
  items.value.unshift(newItem)

  // Log in staff audit log
  const newLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    staffName: newItem.reporterName,
    actionType: 'report_created',
    actionLabelTh: `แจ้ง${newItem.type === 'lost' ? 'ของหาย' : 'เก็บของได้'}ใหม่`,
    actionLabelEn: `New Report (${newItem.type})`,
    itemId: newItem.id,
    itemTitle: newItem.titleTh,
    claimantInfo: `${newItem.reporterName} (${newItem.reporterContact})`,
    notes: `ลงทะเบียนรายการใหม่ สี: ${newItem.colorNameTh || newItem.color} อาคาร: ${newItem.locationDetailTh} รอตรวจสอบ`,
    statusBadgeClass: 'bg-amber-100 text-amber-800 border-amber-200'
  }
  auditLogs.value.unshift(newLog)
  saveData()
  isReportModalOpen.value = false

  // Trigger 5-Factor matching engine
  const matches = findMatches(newItem, items.value)

  if (matches.length > 0 && matches[0].totalScore >= 50) {
    const bestMatch = matches[0]

    // Dispatch simulated campus match email (Primary notification)
    const matchEmail = dispatchEmail({
      to: `${newItem.reporterName}@univ.ac.th`,
      toName: newItem.reporterName,
      subject: `[LostStuff] แจ้งเตือนด่วน: พบคู่ตรงของหายในระบบ (${bestMatch.totalScore}% Match)`,
      previewText: `ระบบตรวจพบ "${bestMatch.candidate.titleTh}" ซึ่งตรงกับสิ่งของที่คุณแจ้ง...`,
      bodyHtmlTh: `
        <div style="font-family: sans-serif; color: #2D2016;">
          <h3 style="color: #784D34;">ระบบตรวจพบรายการที่มีความใกล้เคียงสูง (${bestMatch.totalScore}%)</h3>
          <p>เรียน คุณ${newItem.reporterName},</p>
          <p>ระบบ Matching Engine วิเคราะห์พบสิ่งของที่ตรงกับรายการของคุณ:</p>
          <div style="background-color: #F5F0EB; padding: 12px; border-radius: 8px;">
            <p><strong>รายการที่พบ:</strong> ${bestMatch.candidate.titleTh} (#${bestMatch.candidate.id})</p>
            <p><strong>สถานที่:</strong> ${bestMatch.candidate.locationDetailTh}</p>
            <p><strong>เหตุผลที่ตรงกัน:</strong> ${bestMatch.reasonsTh.join(', ')}</p>
          </div>
          <p>กรุณาตรวจสอบรายละเอียดและยื่นขอรับคืนผ่านระบบ</p>
        </div>
      `,
      badgeType: 'match'
    })
    emails.value.unshift(matchEmail)

    // If high confidence (>= 60%), pop up the instant Match Alert Modal
    if (bestMatch.totalScore >= 60) {
      activeMatchSourceItem.value = newItem
      activeMatchData.value = bestMatch
      isMatchAlertOpen.value = true
    } else {
      showToast({
        title: isTh.value ? 'ตรวจพบรายการที่อาจตรงกัน' : 'Potential Match Found',
        message: isTh.value ? `พบรายการที่ตรงกัน ${bestMatch.totalScore}% ในระบบ พร้อมส่งอีเมลแจ้งเตือนแล้ว` : `Found ${bestMatch.totalScore}% matching item. Email notification sent.`,
        type: 'match'
      })
    }
  } else {
    showToast({
      title: isTh.value ? 'บันทึกรายการสำเร็จ!' : 'Report Submitted!',
      message: isTh.value ? 'รายการถูกส่งเข้าสู่คิวรอเจ้าหน้าที่ตรวจสอบ และระบบกำลังช่วยจับคู่อัตโนมัติ' : 'Item queued for staff review and active matching.',
      type: 'success'
    })
  }
}

function handleVerifyClaimFromAlert(candidateItem) {
  isMatchAlertOpen.value = false
  openItemDetail(candidateItem)
}

function clearEmails() {
  emails.value = []
  saveEmails([])
  showToast({
    title: isTh.value ? 'ล้างกล่องอีเมลแล้ว' : 'Mailbox Cleared',
    message: isTh.value ? 'ล้างข้อความจำลองในกล่องอีเมลเรียบร้อย' : 'All simulated emails cleared.',
    type: 'info'
  })
}
</script>
