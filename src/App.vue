<template>
  <div class="min-h-screen flex flex-col bg-brand-paper text-brand-espresso">
    
    <!-- ADMIN VIEW: RENDERED WHEN PATH IS /admin -->
    <div v-if="isAdminRoute" class="flex-1 flex flex-col">
      <AdminPortal
        :items="items"
        :auditLogs="auditLogs"
        :currentLang="currentLang"
        :t="t"
        :backendConfigured="isBackendConfigured"
        :claims="claims"
        :busyClaimId="reviewingClaimId"
        :busyItemId="approvingItemId"
        @navigate-home="navigateTo('/')"
        @lang-change="handleLangChange"
        @approve-item="handleApproveItem"
        @reject-item="handleRejectItem"
        @confirm-return="handleStaffConfirmReturn"
        @reset-data="resetDemoData"
        @review-claim="handleReviewClaim"
      />
    </div>

    <!-- STUDENT PUBLIC VIEW: RENDERED FOR ALL PUBLIC ROUTES -->
    <div v-else class="flex-1 flex flex-col pb-[calc(4rem_+_env(safe-area-inset-bottom))] md:pb-0">
      
      <!-- Public Navbar (No Bell, No Staff/Eval buttons, Email Mailbox as primary) -->
      <Navbar 
        :activeTab="isPrivacyRoute ? '' : activeTab"
        :currentLang="currentLang"
        :myReportsCount="myItems.length"
        :emailsCount="unreadEmailsCount"
        :notificationsCount="unreadNotificationsCount"
        :user="currentUser"
        :backendConfigured="isBackendConfigured"
        :theme="currentTheme"
        :t="t"
        @nav-change="handleNavChange"
        @lang-change="handleLangChange"
        @open-report="openReportModal"
        @open-emails="isEmailModalOpen = true"
        @open-notifications="isNotificationsOpen = true"
        @theme-change="handleThemeChange"
        @sign-in="isAuthModalOpen = true"
        @sign-out="signOut"
      />

      <!-- Main Content Container -->
      <main class="flex-1">
        <Transition name="page-switch" mode="out-in">
        <PrivacyPolicy
          v-if="isPrivacyRoute"
          :key="`privacy-${currentLang}`"
          :currentLang="currentLang"
          :backendConfigured="isBackendConfigured"
          @navigate-home="navigateTo('/')"
        />
        
        <!-- TAB: HOME -->
        <div v-else-if="activeTab === 'home'" :key="`home-${currentLang}`">
          <!-- Hero Search & Action Centerpiece -->
          <HeroBanner 
            v-model:searchQuery="searchQuery"
            :activeLostCount="activeLostCount"
            :currentLang="currentLang"
            :t="t"
            @trigger-search="activeTab = 'search'"
            @quick-find="openQuickFoundSearch"
            @open-report="openReportModal"
          />

          <!-- Discovery Feed Preview on Home -->
          <section v-reveal class="border-t border-brand-sand/60 bg-brand-paper py-12">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

            <div v-else>
              <div :class="viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-3'">
                <ItemCard
                  v-for="item in homeVisibleItems"
                  :key="item.id"
                  :item="item"
                  :viewMode="viewMode"
                  :currentLang="currentLang"
                  :t="t"
                  @select-item="openItemDetail"
                />
              </div>

              <div v-if="hasMoreHomeItems" class="mt-8 flex flex-col items-center gap-2">
                <button
                  type="button"
                  class="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-brand-tan bg-brand-paper px-6 py-2.5 text-sm font-bold text-brand-chestnut shadow-warm-sm transition-colors hover:border-brand-caramel hover:bg-brand-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-caramel focus-visible:ring-offset-2 focus-visible:ring-offset-brand-paper"
                  @click="showMoreHomeItems"
                >
                  <span>{{ t('btnLoadMore') }}</span>
                  <ChevronDown class="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
                </button>
                <p class="text-xs font-medium text-brand-mocha/70" aria-live="polite">
                  {{ isTh ? `แสดง ${homeVisibleItems.length} จาก ${filteredItems.length} รายการ` : `Showing ${homeVisibleItems.length} of ${filteredItems.length} items` }}
                </p>
              </div>
            </div>
            </div>
          </section>

          <!-- Campus Handover Points Directory -->
          <CampusHandoverSection v-reveal :currentLang="currentLang" :t="t" />

          <!-- Recovery Statistics Section -->
          <section v-reveal class="border-t border-brand-sand/70 bg-brand-sand/35 py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="max-w-4xl mx-auto rounded-xl bg-brand-paper border border-brand-sand shadow-warm-sm overflow-hidden">
                <div class="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-brand-sand/80">
                  
                  <div class="p-4 flex flex-col items-center text-center">
                    <span class="text-[11px] text-brand-mocha/70 font-semibold mb-1 uppercase tracking-wider">{{ t('statReturnedRate') }}</span>
                    <div class="flex items-center gap-1.5">
                      <span class="text-xl sm:text-2xl font-bold text-brand-espresso">{{ homeStats.returnRate }}</span>
                      <span class="w-2 h-2 rounded-full bg-found"></span>
                    </div>
                  </div>

                  <div class="p-4 flex flex-col items-center text-center">
                    <span class="text-[11px] text-brand-mocha/70 font-semibold mb-1 uppercase tracking-wider">{{ t('statReturnedCount') }}</span>
                    <span class="text-xl sm:text-2xl font-bold text-brand-espresso">{{ homeStats.returned }}</span>
                  </div>

                  <div class="p-4 flex flex-col items-center text-center">
                    <span class="text-[11px] text-brand-mocha/70 font-semibold mb-1 uppercase tracking-wider">{{ t('statActivePosts') }}</span>
                    <div class="flex items-center gap-1.5">
                      <span class="text-xl sm:text-2xl font-bold text-brand-espresso">{{ activeLostCount }}</span>
                      <span class="w-2 h-2 rounded-full bg-lost animate-pulse"></span>
                    </div>
                  </div>

                  <div class="p-4 flex flex-col items-center text-center">
                    <span class="text-[11px] text-brand-mocha/70 font-semibold mb-1 uppercase tracking-wider">{{ homeStats.lastLabel }}</span>
                    <span class="text-xl sm:text-2xl font-bold text-brand-espresso">{{ homeStats.lastValue }} <span class="text-xs font-normal text-brand-mocha/70">{{ homeStats.lastUnit }}</span></span>
                  </div>

                </div>
              </div>
            </div>
          </section>

          <!-- How It Works 3-Step Workflow Section -->
          <section v-reveal class="border-t border-brand-sand/70 bg-brand-paper py-12">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="text-center max-w-xl mx-auto mb-8">
                <h2 class="text-xl sm:text-2xl font-bold text-brand-espresso">
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
          <FaqSection v-reveal :currentLang="currentLang" :t="t" />

          <!-- Satisfaction Survey -->
          <SatisfactionSurveySection v-reveal :currentLang="currentLang" :t="t" />
        </div>

        <!-- TAB: SEARCH & DISCOVERY HUB -->
        <div v-else-if="activeTab === 'search'" :key="`search-${currentLang}`" class="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div v-else-if="activeTab === 'my-posts'" :key="`my-posts-${currentLang}`" class="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MyItemsTracker
            :myItems="myItems"
            :myClaims="myClaims"
            :currentLang="currentLang"
            :t="t"
            :allowStatusChanges="!isBackendConfigured"
            @open-report="openReportModal"
            @select-item="openItemDetail"
            @mark-returned="markItemReturned"
          />
        </div>

        <!-- TAB: LOCATIONS DIRECTORY -->
        <div v-else-if="activeTab === 'locations'" :key="`locations-${currentLang}`">
          <CampusHandoverSection v-reveal :currentLang="currentLang" :t="t" />
        </div>

        </Transition>

      </main>

      <!-- Public Footer -->
      <footer class="bg-brand-cream/80 border-t border-brand-sand py-10 mt-16 text-xs text-brand-mocha">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="font-bold text-sm text-brand-espresso">Foundit<span class="text-brand-caramel">-KKU</span></span>
              <span class="px-2 py-0.5 rounded-full text-[10px] bg-brand-sand font-bold text-brand-chestnut">v2.0</span>
            </div>
            <p class="text-brand-latte">{{ t('footerDesc') }}</p>
            <p class="text-brand-latte mt-1">{{ t('footerDisclaimer') }}</p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <a
              href="/privacy"
              class="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-3 py-1.5 font-bold text-brand-chestnut transition-colors hover:bg-brand-sand/70 hover:text-brand-espresso"
              :aria-current="isPrivacyRoute ? 'page' : undefined"
              @click.prevent="navigateTo('/privacy')"
            >
              <LockKeyhole class="h-3.5 w-3.5" aria-hidden="true" />
              <span>{{ t('footerPrivacy') }}</span>
            </a>

            <!-- With a backend, only staff see the portal entry; the route itself is also role-gated -->
            <button
              v-if="!isBackendConfigured || isStaff"
              @click="navigateTo('/admin')"
              class="px-3 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck class="w-3.5 h-3.5 text-stone-700" />
              <span>{{ t('navStaffPortal') }}</span>
            </button>

            <!-- Reset Demo Data: only meaningful for the localStorage demo -->
            <button
              v-if="!isBackendConfigured"
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

      <MobileNav
        :activeTab="isPrivacyRoute ? '' : activeTab"
        :currentLang="currentLang"
        :myReportsCount="myItems.length"
        :user="currentUser"
        :backendConfigured="isBackendConfigured"
        :t="t"
        @nav-change="handleNavChange"
        @sign-in="isAuthModalOpen = true"
        @sign-out="signOut"
      />

    </div>

    <!-- MODALS -->

    <!-- 1. Report Modal (Lost / Found) with 5-Factor attributes -->
    <ReportModal
      v-if="isReportModalOpen"
      :reportType="activeReportType"
      :currentLang="currentLang"
      :t="t"
      :backendConfigured="isBackendConfigured"
      :submitting="isSubmittingReport"
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

    <!-- 4. Quick Found-Item Search with previous / next browsing -->
    <QuickFoundModal
      v-if="isQuickFoundOpen && quickFoundMatches.length"
      :items="quickFoundMatches"
      :currentIndex="quickFoundIndex"
      :searchQuery="quickFoundQuery"
      :currentLang="currentLang"
      :t="t"
      @close="closeQuickFoundSearch"
      @previous="showPreviousQuickFoundItem"
      @next="showNextQuickFoundItem"
      @claim-item="handleQuickFoundClaim"
    />

    <!-- 5. Ownership Claim Modal (Proposal Use-Case) -->
    <ClaimModal
      v-if="isClaimModalOpen && claimingTargetItem"
      :item="claimingTargetItem"
      :currentLang="currentLang"
      :t="t"
      @close="isClaimModalOpen = false"
      @submit-claim="handleSubmitClaim"
    />

    <!-- 6. Simulated Email Mailbox Drawer (Primary Notification Center) -->
    <EmailInboxModal
      v-if="isEmailModalOpen"
      :emails="emails"
      :currentLang="currentLang"
      :t="t"
      @close="isEmailModalOpen = false"
      @clear-emails="clearEmails"
    />

    <NotificationsModal
      v-if="isNotificationsOpen"
      :notifications="notifications"
      :currentLang="currentLang"
      :t="t"
      @close="isNotificationsOpen = false"
      @mark-all-read="markNotificationsReadSafely"
      @open-notification="openNotification"
    />

    <AuthModal
      v-if="isAuthModalOpen && isBackendConfigured"
      :currentLang="currentLang"
      @close="isAuthModalOpen = false"
      @open-privacy="openPrivacyFromAuth"
    />

    <!-- Toast Notifications Container -->
    <ToastNotification :toasts="toasts" @dismiss="dismissToast" />

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, defineAsyncComponent, h } from 'vue'
import { 
  FileText, Cpu, ShieldCheck, ArrowRight, ChevronDown, RotateCcw, LockKeyhole
} from 'lucide-vue-next'

import Navbar from './components/Navbar.vue'
import HeroBanner from './components/HeroBanner.vue'
import FilterSidebar from './components/FilterSidebar.vue'
import ItemCard from './components/ItemCard.vue'
import ItemDetailModal from './components/ItemDetailModal.vue'
import QuickFoundModal from './components/QuickFoundModal.vue'
import ReportModal from './components/ReportModal.vue'
import MatchAlertModal from './components/MatchAlertModal.vue'
import CampusHandoverSection from './components/CampusHandoverSection.vue'
import FaqSection from './components/FaqSection.vue'
import SatisfactionSurveySection from './components/SatisfactionSurveySection.vue'
import MyItemsTracker from './components/MyItemsTracker.vue'
import ToastNotification from './components/ToastNotification.vue'
import MobileNav from './components/MobileNav.vue'
import PrivacyPolicy from './components/PrivacyPolicy.vue'

// Admin & Claim & Email components
// Only staff ever render the portal, so keep it out of the main bundle.
// A deploy renames the chunk, so an old tab can fail to fetch it; offer a reload.
const AdminPortal = defineAsyncComponent({
  loader: () => import('./components/AdminPortal.vue'),
  delay: 200,
  loadingComponent: {
    render: () => h('p', { class: 'py-24 text-center text-sm text-brand-mocha' }, t('adminPortalLoading')),
  },
  errorComponent: {
    render: () => h('div', { class: 'py-24 flex flex-col items-center gap-3 text-sm text-brand-mocha' }, [
      h('p', t('adminPortalLoadFailed')),
      h('button', {
        type: 'button',
        class: 'px-4 py-2 rounded-xl text-xs font-bold bg-brand-chestnut hover:bg-brand-mocha text-white',
        onClick: () => window.location.reload(),
      }, t('reloadPage')),
    ]),
  },
})
import ClaimModal from './components/ClaimModal.vue'
import EmailInboxModal from './components/EmailInboxModal.vue'
import NotificationsModal from './components/NotificationsModal.vue'
import AuthModal from './components/AuthModal.vue'

import { initialMockItems } from './data/mockItems'
import { initialAuditLogs } from './data/auditLogs'
import { translations } from './data/i18n'
import { findMatches } from './utils/matchingEngine'
import { getQuickFoundMatches } from './utils/quickFoundSearch'
import { loadEmails, saveEmails, dispatchEmail, resetEmails } from './utils/emailNotifier'
import { isBackendConfigured, supabase } from './lib/supabase'
import {
  createClaim, createItem, DUPLICATE_CLAIM, getCurrentProfile, getCurrentUser, ITEM_UNAVAILABLE,
  listAuditEvents, listClaimsForStaff, listMyClaims, listVisibleItems, reviewClaim, sendNotifications, updateItemStatus,
} from './services/lostFoundRepository'
import { toAuditLogEntry } from './utils/auditLog'
import { useNotifications } from './composables/useNotifications'
import {
  buildApprovalNotifications, buildClaimDecisionNotification, findBestOwnMatch, findInstantMatches,
  MATCH_ALERT_SCORE, NOTIFICATION_KINDS,
} from './utils/notifications'

const revealObservers = new WeakMap()
const vReveal = {
  mounted(element) {
    element.classList.add('section-reveal')

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.classList.add('is-revealed')
      return
    }

    element.classList.add('is-waiting')
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      window.requestAnimationFrame(() => {
        element.classList.remove('is-waiting')
        element.classList.add('is-revealed')
      })
      observer.unobserve(element)
    }, {
      threshold: 0.06,
      rootMargin: '0px',
    })

    revealObservers.set(element, observer)
    observer.observe(element)
  },
  unmounted(element) {
    revealObservers.get(element)?.disconnect()
    revealObservers.delete(element)
  },
}

// Routing State
const currentPath = ref(window.location.pathname || '/')
const isStaff = computed(() => ['staff', 'admin'].includes(currentProfile.value?.role))
const isPrivacyRoute = computed(() => currentPath.value === '/privacy' || currentPath.value.startsWith('/privacy/'))
const isAdminRoute = computed(() => {
  // With a backend, the portal needs both the /admin path and a staff role; RLS
  // still enforces staff-only data access server-side.
  if (isBackendConfigured) return isStaff.value && currentPath.value.startsWith('/admin')
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
const currentTheme = ref(document.documentElement.dataset.theme === 'mono-red' ? 'mono-red' : 'warm')
const activeTab = ref('home')
const items = ref([])
const auditLogs = ref([])
const emails = ref([])
const currentUser = ref(null)
const currentProfile = ref(null)
const profileLoadFailed = ref(false)
const claims = ref([]) // staff: every claim
const myClaims = ref([]) // the signed-in user's own claims
const reviewingClaimId = ref(null)
const approvingItemId = ref(null)
const isSubmittingReport = ref(false)

// Filters
const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedCategory = ref('')
const selectedColor = ref('')
const selectedBuilding = ref('')
const selectedSort = ref('newest')
const viewMode = ref('grid')
const homeVisibleCount = ref(6)

// Modals State
const isReportModalOpen = ref(false)
const activeReportType = ref('lost')
const selectedItem = ref(null)

const isQuickFoundOpen = ref(false)
const quickFoundMatches = ref([])
const quickFoundIndex = ref(0)
const quickFoundQuery = ref('')

const isMatchAlertOpen = ref(false)
const activeMatchSourceItem = ref(null)
const activeMatchData = ref(null)

const isClaimModalOpen = ref(false)
const claimingTargetItem = ref(null)
const isEmailModalOpen = ref(false)
const isAuthModalOpen = ref(false)
const isNotificationsOpen = ref(false)

const {
  notifications,
  unreadCount: unreadNotificationsCount,
  refresh: refreshNotifications,
  markAllRead: markAllNotificationsRead,
  clear: clearNotifications,
} = useNotifications({
  enabled: isBackendConfigured,
  getUserId: () => currentUser.value?.id || null,
  onNewUnread: (count) => showToast({
    title: t('notifArrivedTitle'),
    message: t('notifArrivedMessage').replace('{count}', count),
    type: 'match',
  }),
})

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

// Supabase returns OAuth failures (for example the Before User Created hook
// rejecting a non-KKU account) as error parameters on the redirect URL.
function showAuthRedirectError() {
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const queryParams = new URLSearchParams(window.location.search)
  const errorCode = hashParams.get('error') || queryParams.get('error')
  if (!errorCode) return
  const description = hashParams.get('error_description') || queryParams.get('error_description') || ''
  const isDomainRejected = /kkumail/i.test(description)
  showToast({
    title: isTh.value ? 'เข้าสู่ระบบไม่สำเร็จ' : 'Sign-in failed',
    message: isDomainRejected
      ? (isTh.value ? 'ใช้ได้เฉพาะบัญชี @kkumail.com เท่านั้น' : 'Only @kkumail.com accounts can sign in.')
      : (isTh.value ? 'โปรดลองเข้าสู่ระบบด้วย Google อีกครั้ง' : 'Please try signing in with Google again.'),
    type: 'info',
    duration: 8000,
  })
  window.history.replaceState(null, '', window.location.pathname)
}

// Global Keyboard & Navigation Listeners
function handlePopState() {
  currentPath.value = window.location.pathname
  explainStaffOnlyRoute()
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
    if (isNotificationsOpen.value) isNotificationsOpen.value = false
  }
}

// Notifications arrive while the tab sits in the background; check again on return.
function handleVisibilityChange() {
  if (document.visibilityState === 'visible') void loadNotificationsSafely()
}

// Someone opening /admin without a staff role sees the public page, so say why.
function explainStaffOnlyRoute() {
  if (!isBackendConfigured || !currentPath.value.startsWith('/admin') || isStaff.value) return
  // A failed profile fetch says nothing about the role, so do not claim "no access".
  if (profileLoadFailed.value) {
    showToast({ title: t('staffOnlyTitle'), message: t('staffCheckFailed'), type: 'info', duration: 8000 })
    return
  }
  showToast({
    title: t('staffOnlyTitle'),
    message: currentUser.value ? t('staffOnlyNoRole') : t('staffOnlySignIn'),
    type: 'info',
    duration: 8000,
  })
  if (!currentUser.value) isAuthModalOpen.value = true
}

onMounted(async () => {
  showAuthRedirectError()
  await loadData()
  explainStaffOnlyRoute()
  if (isBackendConfigured) {
    supabase.auth.onAuthStateChange((_event, session) => {
      currentUser.value = session?.user || null
      // Claims and the audit log depend on the role, so load them once the profile is in.
      void refreshCurrentProfile().then(() => Promise.all([loadClaimsSafely(), loadAuditLogsSafely()])).catch((error) => {
        console.error('Unable to refresh user profile', error)
      })
      void loadNotificationsSafely()
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
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('popstate', handlePopState)
  window.removeEventListener('hashchange', handlePopState)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})

async function loadData() {
  if (isBackendConfigured) {
    try {
      currentUser.value = await getCurrentUser()
      await refreshCurrentProfile()
      await loadBackendItems()
      await Promise.all([loadClaimsSafely(), loadAuditLogsSafely(), loadNotificationsSafely()])
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
  try {
    currentProfile.value = currentUser.value ? await getCurrentProfile() : null
    profileLoadFailed.value = false
  } catch (error) {
    profileLoadFailed.value = true
    throw error
  }
}

// Staff see every claim; everyone else only needs their own.
async function loadClaims() {
  if (!isBackendConfigured || !currentUser.value) {
    claims.value = []
    myClaims.value = []
    return
  }
  const [staffClaims, ownClaims] = await Promise.all([
    isStaff.value ? listClaimsForStaff() : Promise.resolve([]),
    listMyClaims(),
  ])
  claims.value = staffClaims
  myClaims.value = ownClaims
}

// Missing claims should not push the whole app into the offline demo.
async function loadClaimsSafely() {
  try {
    await loadClaims()
  } catch (error) {
    console.error('Unable to load claims', error)
    showToast({ title: t('claimsLoadFailedTitle'), message: error.message, type: 'warning' })
  }
}

// Only staff can read audit events; everyone else keeps an empty log.
async function loadAuditLogsSafely() {
  if (!isBackendConfigured) return
  if (!currentUser.value || !isStaff.value) {
    auditLogs.value = []
    return
  }
  try {
    const entries = (await listAuditEvents()).map(toAuditLogEntry)
    // A sign-out can land while the request is in flight.
    auditLogs.value = isStaff.value ? entries : []
  } catch (error) {
    console.error('Unable to load audit events', error)
    showToast({ title: t('auditLoadFailedTitle'), message: error.message, type: 'warning' })
  }
}

// A missing notification list should not interrupt anything else, so only log.
function loadNotificationsSafely() {
  return refreshNotifications().catch((error) => {
    console.error('Unable to load notifications', error)
  })
}

function markNotificationsReadSafely() {
  void markAllNotificationsRead().catch((error) => {
    console.error('Unable to mark notifications read', error)
  })
}

// Notifications are a courtesy: a failure is reported, but the staff action it follows stands.
async function sendNotificationsSafely(list) {
  try {
    await sendNotifications(list)
  } catch (error) {
    console.error('Unable to send notifications', error)
    showToast({ title: t('notifSendFailedTitle'), message: error.message, type: 'warning' })
  }
}

const CLAIM_NOTIFICATION_KINDS = [NOTIFICATION_KINDS.CLAIM_APPROVED, NOTIFICATION_KINDS.CLAIM_REJECTED, NOTIFICATION_KINDS.CLAIM_COMPLETED]

// A match opens the side-by-side alert, a claim update opens My Reports, anything else the item.
function openNotification(notification) {
  isNotificationsOpen.value = false
  if (CLAIM_NOTIFICATION_KINDS.includes(notification.kind)) {
    handleNavChange('my-posts')
    void loadClaimsSafely()
    return
  }
  const linked = items.value.find(item => item.id === notification.itemId)
  if (!linked) {
    showToast({ title: t('notifTitle'), message: t('notifItemUnavailable'), type: 'info' })
    return
  }
  const best = notification.kind === NOTIFICATION_KINDS.MATCH ? findBestOwnMatch(linked, myItems.value) : null
  if (best) {
    activeMatchSourceItem.value = best.source
    activeMatchData.value = best.match
    isMatchAlertOpen.value = true
    return
  }
  openItemDetail(linked)
}

// Right after a lost report, point the reporter at published found items that already look like it.
function showInstantMatches(itemId) {
  const reported = items.value.find(item => item.id === itemId)
  if (!reported) return
  const [best] = findInstantMatches(reported, items.value)
  if (!best) return
  if (best.totalScore >= MATCH_ALERT_SCORE) {
    activeMatchSourceItem.value = reported
    activeMatchData.value = best
    isMatchAlertOpen.value = true
    return
  }
  showToast({
    title: t('instantMatchTitle'),
    message: t('instantMatchMessage').replace('{score}', best.totalScore),
    type: 'match',
    duration: 8000,
  })
}

const CLAIM_DECISION_MESSAGES = {
  approved: 'claimApprovedMessage',
  rejected: 'claimRejectedMessage',
  completed: 'claimCompletedMessage',
}

async function handleReviewClaim({ claimId, decision, note }) {
  if (reviewingClaimId.value) return
  reviewingClaimId.value = claimId
  const claim = claims.value.find(candidate => candidate.id === claimId)
  try {
    await reviewClaim({ claimId, decision, note })
    showToast({ title: t('claimReviewedTitle'), message: t(CLAIM_DECISION_MESSAGES[decision]), type: 'success' })
    const notification = buildClaimDecisionNotification(claim, decision, note)
    if (notification) void sendNotificationsSafely([notification])
  } catch (error) {
    const message = error.code === ITEM_UNAVAILABLE ? t('claimItemNoLongerAvailable') : error.message
    showToast({ title: t('claimReviewFailedTitle'), message, type: 'warning', duration: 8000 })
  } finally {
    reviewingClaimId.value = null
  }
  // Refresh either way: a failure usually means someone changed the item first.
  await Promise.all([loadBackendItems(), loadClaims(), loadAuditLogsSafely()]).catch((error) => {
    console.error('Unable to refresh after reviewing a claim', error)
  })
}

async function signOut() {
  await supabase.auth.signOut()
  currentUser.value = null
  currentProfile.value = null
  claims.value = []
  myClaims.value = []
  auditLogs.value = []
  clearNotifications()
  isNotificationsOpen.value = false
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

// Real figures once a backend is connected; the offline demo keeps its showcase numbers.
const homeStats = computed(() => {
  if (!isBackendConfigured) {
    return { returnRate: '94.2%', returned: '1,280+', lastLabel: t('statAvgMatchTime'), lastValue: '15', lastUnit: t('statMinutes') }
  }
  const published = items.value.filter(item => ['searching', 'pending_confirm', 'returned'].includes(item.status)).length
  const returned = items.value.filter(item => item.status === 'returned').length
  return {
    returnRate: published === 0 ? '-' : `${((returned / published) * 100).toFixed(1)}%`,
    returned: String(returned),
    // No match timings are recorded, so show how many listings are public instead.
    lastLabel: t('statPublishedItems'),
    lastValue: String(published),
    lastUnit: t('statItems'),
  }
})
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
      const target = selectedColor.value.toLowerCase()
      if (item.color && item.color.toLowerCase() === target) return true
      const colorVal = (item.color || item.colorNameTh || item.colorNameEn || '').toLowerCase()
      if (target === 'navy' && (colorVal.includes('น้ำเงิน') || colorVal.includes('navy') || colorVal.includes('กรม'))) return true
      if (target === 'lightblue' && (colorVal.includes('ฟ้า') || colorVal.includes('lightblue') || colorVal.includes('light blue') || colorVal.includes('sky'))) return true
      return colorVal.includes(target)
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

const homeVisibleItems = computed(() => filteredItems.value.slice(0, homeVisibleCount.value))
const hasMoreHomeItems = computed(() => homeVisibleCount.value < filteredItems.value.length)

function showMoreHomeItems() {
  homeVisibleCount.value += 6
}

watch(
  [searchQuery, selectedStatus, selectedCategory, selectedColor, selectedBuilding, selectedSort],
  () => {
    homeVisibleCount.value = 6
  }
)

// Navigation Handlers
function handleNavChange(tab) {
  if (isPrivacyRoute.value) navigateTo('/')
  activeTab.value = tab
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
}

function handleLangChange(lang) {
  currentLang.value = lang
}

function handleThemeChange(theme) {
  currentTheme.value = theme === 'mono-red' ? 'mono-red' : 'warm'
  document.documentElement.dataset.theme = currentTheme.value
  try {
    localStorage.setItem('foundit-theme', currentTheme.value)
  } catch (_) {
    // Theme switching still works when storage is unavailable.
  }
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

function openPrivacyFromAuth() {
  isAuthModalOpen.value = false
  navigateTo('/privacy')
}

function openQuickFoundSearch() {
  const itemName = searchQuery.value.trim()

  if (!itemName) {
    showToast({
      title: t('quickFoundEmptyTitle'),
      message: t('quickFoundEnterName'),
      type: 'info',
    })
    return
  }

  const matches = getQuickFoundMatches(itemName, items.value)

  if (matches.length === 0) {
    showToast({
      title: t('quickFoundEmptyTitle'),
      message: t('quickFoundEmptyMessage'),
      type: 'info',
    })
    return
  }

  quickFoundMatches.value = matches
  quickFoundIndex.value = 0
  quickFoundQuery.value = itemName
  isQuickFoundOpen.value = true
}

function closeQuickFoundSearch() {
  isQuickFoundOpen.value = false
  quickFoundMatches.value = []
  quickFoundIndex.value = 0
}

function showPreviousQuickFoundItem() {
  quickFoundIndex.value = Math.max(0, quickFoundIndex.value - 1)
}

function showNextQuickFoundItem() {
  quickFoundIndex.value = Math.min(quickFoundMatches.value.length - 1, quickFoundIndex.value + 1)
}

function handleQuickFoundClaim(item) {
  closeQuickFoundSearch()
  handleClaimItem(item)
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
    // A second click, from the queue row or the inspect modal, must not send
    // the same notifications twice.
    if (approvingItemId.value) return
    approvingItemId.value = itemId
    try {
      const published = await updateItemStatus(itemId, 'searching', 'item_approved', {}, { fromStatus: 'pending_review' })
      await loadBackendItems()
      if (!published) {
        showToast({ title: t('itemAlreadyHandledTitle'), message: t('itemAlreadyHandledMessage'), type: 'info' })
        return
      }
      showToast({ title: isTh.value ? 'อนุมัติรายการแล้ว' : 'Item approved', message: isTh.value ? 'รายการเผยแพร่แล้ว' : 'The item is now published.', type: 'success' })
      void loadAuditLogsSafely()
      // Tell the owner it is live, and whoever lost the item in each likely match.
      const approved = items.value.find(item => item.id === itemId)
      if (approved) void sendNotificationsSafely(buildApprovalNotifications(approved, items.value))
    } catch (error) {
      showToast({ title: 'Could not approve item', message: error.message, type: 'info' })
    } finally {
      approvingItemId.value = null
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
      subject: `[Foundit-KKU] รายการของคุณได้รับการอนุมัติแล้ว (#${target.id} ${target.titleTh})`,
      previewText: `เจ้าหน้าที่ได้ตรวจสอบและอนุมัติรายการของท่านขึ้นสู่ระบบค้นหาของมหาวิทยาลัยแล้ว...`,
      bodyHtmlTh: `
        <div style="font-family: 'Kanit', 'Segoe UI', sans-serif; color: #2D2016;">
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
      showToast({ title: isTh.value ? 'ปิดรายการแล้ว' : 'Case closed', message: isTh.value ? 'รายการนี้ไม่แสดงต่อสาธารณะแล้ว' : 'The item is no longer public.', type: 'info' })
      void loadAuditLogsSafely()
    } catch (error) {
      showToast({ title: isTh.value ? 'ปิดรายการไม่สำเร็จ' : 'Could not close item', message: error.message, type: 'info' })
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
      // Keep who collected the item and the staff notes in the audit log.
      await updateItemStatus(itemId, 'returned', 'return_confirmed', { claimant, notes })
      await loadBackendItems()
      showToast({ title: isTh.value ? 'บันทึกการส่งมอบสำเร็จ' : 'Return confirmed', message: isTh.value ? 'รายการเปลี่ยนเป็นส่งคืนแล้ว และบันทึกลงประวัติ Audit' : 'The item is marked returned and logged.', type: 'success' })
      void loadAuditLogsSafely()
    } catch (error) {
      showToast({ title: isTh.value ? 'ยืนยันการส่งคืนไม่สำเร็จ' : 'Could not confirm return', message: error.message, type: 'info' })
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
      subject: `[Foundit-KKU] ยืนยันการส่งมอบคืนสิ่งของสำเร็จ (#${target.id})`,
      previewText: `เจ้าหน้าที่ได้บันทึกการส่งมอบคืน ${target.titleTh} แก่ท่านเรียบร้อยแล้ว...`,
      bodyHtmlTh: `
        <div style="font-family: 'Kanit', 'Segoe UI', sans-serif; color: #2D2016;">
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
      showToast({ title: isTh.value ? 'ยื่นคำขอสำเร็จ' : 'Claim submitted', message: isTh.value ? 'เจ้าหน้าที่จะตรวจสอบหลักฐานของคุณ ติดตามสถานะได้ที่รายการของฉัน' : 'Staff will review your proof. Track it under My Reports.', type: 'success' })
    } catch (error) {
      const message = error.code === DUPLICATE_CLAIM ? t('claimDuplicate') : error.message
      showToast({ title: isTh.value ? 'ส่งคำขอไม่สำเร็จ' : 'Could not submit claim', message, type: 'info' })
      return
    }
    await loadClaimsSafely()
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
      subject: `[Foundit-KKU] ได้รับคำขอยื่นยืนยันความเป็นเจ้าของแล้ว (#${target.id})`,
      previewText: `ระบบได้รับข้อมูลหลักฐานยืนยันสิ่งของ "${target.titleTh}" ของท่านเรียบร้อยแล้ว...`,
      bodyHtmlTh: `
        <div style="font-family: 'Kanit', 'Segoe UI', sans-serif; color: #2D2016;">
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
    if (isSubmittingReport.value) return
    isSubmittingReport.value = true
    let result
    try {
      result = await createItem({ item: newItem, imageFile: newItem.imageFile })
    } catch (error) {
      showToast({ title: isTh.value ? 'ส่งรายการไม่สำเร็จ' : 'Could not submit report', message: error.message, type: 'info' })
      return
    } finally {
      isSubmittingReport.value = false
    }
    // From here the report exists, so never tell the user it failed.
    isReportModalOpen.value = false
    if (result.imageError) {
      console.error('Report saved without its photo', result.imageError)
      showToast({ title: t('reportSavedNoImageTitle'), message: t('reportSavedNoImageMessage'), type: 'warning', duration: 8000 })
    } else {
      showToast({ title: isTh.value ? 'ส่งรายการแล้ว' : 'Report submitted', message: isTh.value ? 'รายการเข้าสู่คิวตรวจสอบแล้ว' : 'Your report is now awaiting review.', type: 'success' })
    }
    await loadBackendItems().catch((error) => {
      console.error('Unable to refresh items after a report', error)
    })
    showInstantMatches(result.id)
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
      subject: `[Foundit-KKU] แจ้งเตือนด่วน: พบคู่ตรงของหายในระบบ (${bestMatch.totalScore}% Match)`,
      previewText: `ระบบตรวจพบ "${bestMatch.candidate.titleTh}" ซึ่งตรงกับสิ่งของที่คุณแจ้ง...`,
      bodyHtmlTh: `
        <div style="font-family: 'Kanit', 'Segoe UI', sans-serif; color: #2D2016;">
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

<style>
.page-switch-enter-active {
  transition:
    opacity 300ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 300ms cubic-bezier(0.16, 1, 0.3, 1),
    filter 260ms ease-out;
}

.page-switch-leave-active {
  transition:
    opacity 150ms ease-in,
    transform 150ms ease-in,
    filter 150ms ease-in;
}

.page-switch-enter-from {
  opacity: 0;
  transform: translate3d(0, 12px, 0);
  filter: blur(4px);
}

.page-switch-leave-to {
  opacity: 0;
  transform: translate3d(0, -6px, 0);
  filter: blur(2px);
}

.section-reveal {
  opacity: 1;
  transform: translate3d(0, 0, 0);
  filter: blur(0);
}

.section-reveal.is-waiting {
  opacity: 0;
  transform: translate3d(0, 28px, 0);
  filter: blur(4px);
}

.section-reveal.is-revealed {
  transition:
    opacity 620ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 620ms cubic-bezier(0.16, 1, 0.3, 1),
    filter 480ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .page-switch-enter-active,
  .page-switch-leave-active,
  .section-reveal,
  .section-reveal.is-waiting,
  .section-reveal.is-revealed {
    transition: none;
    transform: none;
    filter: none;
  }

  .section-reveal,
  .section-reveal.is-waiting {
    opacity: 1;
  }
}
</style>
