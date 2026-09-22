<template>
  <div class="min-h-screen bg-[#F7F4F0] text-brand-espresso flex flex-col font-sans selection:bg-brand-chestnut/15 selection:text-brand-espresso">
    
    <!-- Admin Top Navbar: Same layout as Home Navbar, but with inverted Warm Espresso palette -->
    <header class="sticky top-0 z-40 bg-[#261B13] text-white border-b border-brand-espresso/40 backdrop-blur-md transition-all shadow-warm-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-14 sm:h-16">
          
          <!-- Brand Logo & Admin Badge (Left) -->
          <div class="flex items-center gap-2.5 cursor-pointer" @click="$emit('navigate-home')">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-caramel to-brand-chestnut flex items-center justify-center text-white shadow-warm-sm border border-brand-caramel/40">
              <ShieldCheck class="w-4.5 h-4.5 text-brand-paper" />
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <span class="font-bold text-base tracking-tight text-white whitespace-nowrap">Foundit<span class="text-brand-caramel">-KKU</span></span>
                <span class="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-caramel/25 text-amber-200 border border-brand-caramel/40 font-mono tracking-wider">
                  /admin
                </span>
              </div>
              <span class="hidden sm:block text-[10px] text-[#C4B3A5] -mt-0.5 tracking-wider">
                {{ isTh ? 'ระบบบริหารจัดการของหาย & เครื่องมือประเมินผลโครงการ' : 'Campus Operations & Project Evaluation Suite' }}
              </span>
            </div>
          </div>

          <!-- Navigation Links (Center): Same layout & text link style as Home, inverted colors -->
          <nav class="hidden md:flex items-center gap-6 text-xs font-semibold">
            <button 
              @click="activeSection = 'pending'"
              class="transition-colors py-1 relative flex items-center gap-1.5 cursor-pointer"
              :class="activeSection === 'pending' ? 'text-white font-bold border-b-2 border-brand-caramel' : 'text-[#C4B3A5] hover:text-white'"
            >
              <span>{{ isTh ? 'คิวรอตรวจสอบ' : 'Pending Review' }}</span>
              <span v-if="pendingItems.length > 0" class="px-1.5 py-0.2 rounded-full text-[10px] bg-lost text-white font-bold animate-pulse">
                {{ pendingItems.length }}
              </span>
            </button>

            <button
              v-if="backendConfigured"
              @click="activeSection = 'claims'"
              class="transition-colors py-1 relative flex items-center gap-1.5 cursor-pointer"
              :class="activeSection === 'claims' ? 'text-white font-bold border-b-2 border-brand-caramel' : 'text-[#C4B3A5] hover:text-white'"
            >
              <span>{{ t('staffTabClaims') }}</span>
              <span v-if="pendingClaimCount > 0" class="px-1.5 py-0.2 rounded-full text-[10px] bg-lost text-white font-bold">
                {{ pendingClaimCount }}
              </span>
            </button>

            <button
              @click="activeSection = 'active'"
              class="transition-colors py-1 relative cursor-pointer"
              :class="activeSection === 'active' ? 'text-white font-bold border-b-2 border-brand-caramel' : 'text-[#C4B3A5] hover:text-white'"
            >
              <span>{{ isTh ? 'จัดการรายการ' : 'All Items' }}</span>
            </button>
            
            <button 
              @click="activeSection = 'audit'"
              class="transition-colors py-1 relative cursor-pointer"
              :class="activeSection === 'audit' ? 'text-white font-bold border-b-2 border-brand-caramel' : 'text-[#C4B3A5] hover:text-white'"
            >
              <span>{{ isTh ? 'ประวัติ Audit' : 'Audit Logs' }}</span>
            </button>

            <button 
              @click="activeSection = 'benchmark'"
              class="transition-colors py-1 relative cursor-pointer"
              :class="activeSection === 'benchmark' ? 'text-white font-bold border-b-2 border-brand-caramel' : 'text-[#C4B3A5] hover:text-white'"
            >
              <span>{{ isTh ? 'ทดสอบความแม่นยำ' : 'Benchmark' }}</span>
            </button>

            <button 
              @click="activeSection = 'survey'"
              class="transition-colors py-1 relative cursor-pointer"
              :class="activeSection === 'survey' ? 'text-white font-bold border-b-2 border-brand-caramel' : 'text-[#C4B3A5] hover:text-white'"
            >
              <span>{{ isTh ? 'แบบประเมิน' : 'Survey' }}</span>
            </button>
          </nav>

          <!-- Right Action Cluster: Inverted dark style -->
          <div class="flex items-center gap-2 sm:gap-2.5">
            <!-- Language Switcher Toggle (TH / EN) -->
            <div class="flex items-center p-1 rounded-xl bg-[#3A2A1E] border border-[#4D3828] text-xs font-bold shadow-2xs">
              <button 
                @click="$emit('lang-change', 'th')"
                class="px-2.5 py-1 rounded-lg transition-all text-xs cursor-pointer"
                :class="currentLang === 'th' ? 'bg-brand-chestnut text-white shadow-warm-xs' : 'text-[#C4B3A5] hover:text-white'"
              >
                TH
              </button>
              <button 
                @click="$emit('lang-change', 'en')"
                class="px-2.5 py-1 rounded-lg transition-all text-xs cursor-pointer"
                :class="currentLang === 'en' ? 'bg-brand-chestnut text-white shadow-warm-xs' : 'text-[#C4B3A5] hover:text-white'"
              >
                EN
              </button>
            </div>

            <!-- Reset Mock Data Button: demo only, it would swap real listings for mock ones -->
            <button
              v-if="!backendConfigured"
              @click="handleReset"
              class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#3A2A1E] hover:bg-[#4D3828] text-amber-200 hover:text-white border border-[#4D3828] transition-colors cursor-pointer shadow-warm-xs"
              :title="isTh ? 'รีเซ็ตข้อมูล Mock Data ทั้งหมด' : 'Reset All Mock Data'"
            >
              <RotateCcw class="w-3.5 h-3.5 text-amber-300" />
              <span class="hidden sm:inline">{{ isTh ? 'รีเซ็ตข้อมูล' : 'Reset Data' }}</span>
            </button>

            <!-- Return to Student View -->
            <button 
              @click="$emit('navigate-home')"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#3A2A1E] hover:bg-[#4D3828] text-brand-sand hover:text-white border border-[#4D3828] transition-colors cursor-pointer shadow-warm-xs"
            >
              <ArrowLeft class="w-3.5 h-3.5" />
              <span class="hidden sm:inline">{{ isTh ? 'กลับสู่หน้าหลัก' : 'Student Portal' }}</span>
            </button>
          </div>

        </div>

        <!-- Mobile Section Selector: its own row, so the top row fits a 375px screen -->
        <div class="md:hidden pb-3">
          <select
            v-model="activeSection"
            :aria-label="isTh ? 'เลือกส่วนของแผงเจ้าหน้าที่' : 'Choose a staff portal section'"
            class="w-full px-3 py-2 rounded-xl bg-[#3A2A1E] border border-[#4D3828] text-xs font-bold text-amber-200 focus:outline-hidden cursor-pointer"
          >
            <option value="pending">{{ isTh ? 'คิวรอตรวจสอบ' : 'Pending' }}</option>
            <option v-if="backendConfigured" value="claims">{{ t('staffTabClaims') }}</option>
            <option value="active">{{ isTh ? 'จัดการรายการ' : 'All Items' }}</option>
            <option value="audit">{{ isTh ? 'ประวัติ Audit' : 'Audit Logs' }}</option>
            <option value="benchmark">{{ isTh ? 'ทดสอบความแม่นยำ' : 'Benchmark' }}</option>
            <option value="survey">{{ isTh ? 'แบบประเมินความพึงพอใจ' : 'Survey' }}</option>
          </select>
        </div>
      </div>
    </header>

    <!-- Quick Situational Awareness Metric Strip with Generous Y-Margin -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-3.5 sm:my-4">
      <div class="bg-brand-cream/80 border border-brand-sand rounded-2xl px-5 sm:px-6 py-3.5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs shadow-2xs">
        
        <div class="flex items-center gap-2.5">
          <span class="w-2.5 h-2.5 rounded-full bg-lost" :class="{ 'animate-pulse': pendingItems.length > 0 }"></span>
          <span class="text-brand-mocha/80 font-medium">{{ isTh ? 'คิวรอตรวจสอบ:' : 'Pending Review:' }}</span>
          <strong class="text-brand-espresso font-bold">{{ pendingItems.length }} {{ isTh ? 'รายการ' : 'items' }}</strong>
        </div>

        <div class="flex items-center gap-2.5">
          <span class="w-2.5 h-2.5 rounded-full bg-brand-chestnut"></span>
          <span class="text-brand-mocha/80 font-medium">{{ isTh ? 'กำลังค้นหาในระบบ:' : 'Active Searching:' }}</span>
          <strong class="text-brand-espresso font-bold">{{ searchingCount }} {{ isTh ? 'รายการ' : 'items' }}</strong>
        </div>

        <div class="flex items-center gap-2.5">
          <span class="w-2.5 h-2.5 rounded-full bg-found"></span>
          <span class="text-brand-mocha/80 font-medium">{{ isTh ? 'ส่งมอบคืนสำเร็จ:' : 'Handed Over:' }}</span>
          <strong class="text-brand-espresso font-bold">{{ returnedCount }} {{ isTh ? 'รายการ' : 'items' }}<template v-if="returnRate !== null"> ({{ returnRate }}%)</template></strong>
        </div>

        <div class="flex items-center gap-2.5">
          <span class="w-2.5 h-2.5 rounded-full bg-match"></span>
          <span class="text-brand-mocha/80 font-medium">{{ isTh ? 'ความแม่นยำระบบจับคู่:' : 'Algorithm Accuracy:' }}</span>
          <strong class="text-match-dark font-extrabold">{{ benchmarkResults ? `${benchmarkResults.accuracy}%` : '-' }} (Benchmark)</strong>
        </div>

      </div>
    </div>

    <!-- Main Admin Content Body -->
    <main class="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-12 flex-1 space-y-6">
      
      <!-- ========================================== -->
      <!-- SECTION 1: PENDING REVIEW QUEUE            -->
      <!-- ========================================== -->
      <div v-if="activeSection === 'pending'" class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 class="text-xl font-extrabold text-brand-espresso tracking-tight">
              {{ isTh ? 'คิวตรวจสอบและอนุมัติรายการใหม่' : 'New Submissions Pending Verification' }}
            </h2>
            <p class="text-xs text-brand-mocha/80 mt-0.5">
              {{ isTh ? 'ตรวจสอบความถูกต้องของข้อมูล 5 มิติ (หมวดหมู่, สี, ยี่ห้อ, จุดสังเกตเฉพาะ, สถานที่) ก่อนอนุมัติเผยแพร่สู่ระบบสาธารณะ' : 'Verify report completeness before publishing.' }}
            </p>
          </div>
          <span class="text-xs text-brand-mocha font-semibold bg-brand-paper px-3 py-1.5 rounded-xl border border-brand-sand">
            {{ pendingItems.length }} {{ isTh ? 'รายการค้างตรวจสอบ' : 'items pending' }}
          </span>
        </div>

        <!-- Empty State -->
        <div v-if="pendingItems.length === 0" class="py-16 text-center bg-brand-paper rounded-3xl border border-brand-sand/80 p-8 shadow-warm-sm">
          <div class="w-12 h-12 rounded-2xl bg-found-light text-found-dark flex items-center justify-center mx-auto mb-3 shadow-warm-xs">
            <CheckCircle2 class="w-6 h-6" />
          </div>
          <h3 class="text-base font-bold text-brand-espresso">
            {{ isTh ? 'ไม่มีรายการค้างตรวจสอบในขณะนี้' : 'No items pending review' }}
          </h3>
          <p class="text-xs text-brand-mocha/70 mt-1 max-w-md mx-auto">
            {{ isTh ? 'ทุกรายการที่ผู้ใช้แจ้งเข้ามาได้รับการตรวจสอบและอนุมัติขึ้นสู่ระบบเรียบร้อยแล้ว' : 'All incoming reports have been inspected and authorized.' }}
          </p>
        </div>

        <!-- Pending Items List -->
        <div v-else class="grid grid-cols-1 gap-5">
          <div 
            v-for="item in pendingItems" 
            :key="item.id"
            class="p-5 sm:p-6 rounded-3xl bg-brand-paper border border-brand-sand shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6"
          >
            <div class="flex items-start gap-4.5 sm:gap-5 min-w-0 flex-1">
              <div class="w-20 h-20 rounded-2xl overflow-hidden bg-brand-sand/50 border border-brand-tan/50 shrink-0">
                <img :src="item.imageUrl" alt="" class="w-full h-full object-cover" />
              </div>

              <div class="min-w-0 space-y-2 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-lost-light text-lost-dark border border-lost-border">
                    {{ t('statusPendingReview') }}
                  </span>
                  <span class="font-mono text-xs text-brand-latte">#{{ item.id }}</span>
                  <span class="text-xs font-bold text-brand-chestnut">
                    {{ item.type === 'lost' ? t('badgeLost') : t('badgeFound') }}
                  </span>
                </div>

                <h4 class="font-bold text-base text-brand-espresso leading-snug">
                  {{ isTh ? item.titleTh : item.titleEn }}
                </h4>

                <!-- 5-Factor attribute summary chips -->
                <div class="flex flex-wrap items-center gap-2 text-[11px] text-brand-mocha">
                  <span v-if="item.colorNameTh || item.color" class="px-2.5 py-0.5 rounded-md bg-brand-cream border border-brand-sand/80 font-medium">
                    {{ isTh ? 'สี: ' : 'Color: ' }}<strong>{{ item.colorNameTh || item.color }}</strong>
                  </span>
                  <span v-if="item.brand" class="px-2.5 py-0.5 rounded-md bg-brand-cream border border-brand-sand/80 font-medium">
                    {{ isTh ? 'ยี่ห้อ: ' : 'Brand: ' }}<strong>{{ item.brand }}</strong>
                  </span>
                  <span class="px-2.5 py-0.5 rounded-md bg-brand-cream border border-brand-sand/80 font-medium">
                    {{ isTh ? item.locationDetailTh : item.locationDetailEn }}
                  </span>
                </div>

                <p v-if="item.distinctiveMarks" class="text-xs text-brand-caramel/90 line-clamp-1 italic">
                  <strong>{{ isTh ? 'จุดสังเกตเฉพาะ: ' : 'Marks: ' }}</strong>{{ item.distinctiveMarks }}
                </p>

                <p class="text-[11px] text-brand-latte pt-0.5">
                  {{ isTh ? 'ผู้แจ้ง: ' : 'Reported by: ' }}<span class="font-semibold text-brand-mocha">{{ item.reporterName }}</span> ({{ item.reporterContact }}) • {{ item.date }}
                </p>
              </div>
            </div>

            <!-- Action cluster -->
            <div class="flex items-center gap-2.5 w-full md:w-auto shrink-0 justify-end pt-3 md:pt-0 border-t md:border-t-0 border-brand-sand/60">
              <button
                @click="openInspectModal(item)"
                class="px-3.5 py-2 rounded-xl border border-brand-sand bg-brand-cream/80 hover:bg-brand-sand text-brand-chestnut text-xs font-bold transition-colors cursor-pointer"
              >
                {{ isTh ? 'ดูรายละเอียดครบถ้วน' : 'Inspect' }}
              </button>

              <button
                @click="handleReject(item)"
                class="px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors cursor-pointer"
              >
                {{ t('staffBtnReject') }}
              </button>

              <button
                @click="handleApprove(item)"
                :disabled="busyItemId !== null"
                class="px-4 py-2 rounded-xl bg-found hover:bg-found-dark text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-warm-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 class="w-4 h-4" />
                <span>{{ t('staffBtnApprove') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- SECTION 1B: OWNERSHIP CLAIMS (backend only) -->
      <!-- ========================================== -->
      <div v-else-if="activeSection === 'claims'" class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 class="text-xl font-extrabold text-brand-espresso tracking-tight">{{ t('staffClaimsTitle') }}</h2>
            <p class="text-xs text-brand-mocha/80 mt-0.5">{{ t('staffClaimsSubtitle') }}</p>
          </div>
          <span class="text-xs text-brand-mocha font-semibold bg-brand-paper px-3 py-1.5 rounded-xl border border-brand-sand">
            {{ openClaimCount }} {{ t('staffClaimsOpenCount') }}
          </span>
        </div>

        <div v-if="claims.length === 0" class="py-16 text-center bg-brand-paper rounded-3xl border border-brand-sand/80 p-8 shadow-warm-sm">
          <Inbox class="w-10 h-10 text-brand-tan mx-auto mb-3" />
          <h3 class="text-base font-bold text-brand-espresso">{{ t('staffClaimsEmpty') }}</h3>
        </div>

        <div v-else class="grid grid-cols-1 gap-4">
          <div
            v-for="claim in sortedClaims"
            :key="claim.id"
            class="p-5 sm:p-6 rounded-3xl bg-brand-paper border border-brand-sand shadow-warm-sm space-y-3"
          >
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border" :class="CLAIM_STATUS_CLASSES[claim.status]">
                {{ t(CLAIM_STATUS_KEYS[claim.status]) }}
              </span>
              <h4 class="font-bold text-base text-brand-espresso leading-snug">
                {{ (isTh ? claim.itemTitleTh : claim.itemTitleEn) || t('claimItemUnavailable') }}
              </h4>
            </div>

            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
              <div>
                <dt class="text-brand-latte">{{ t('claimantLabel') }}</dt>
                <dd class="font-semibold text-brand-espresso">{{ claim.claimantName || '-' }}</dd>
              </div>
              <div>
                <dt class="text-brand-latte">{{ t('claimContactLabel') }}</dt>
                <dd class="font-semibold text-brand-espresso break-all">{{ claim.preferredContact }}</dd>
              </div>
              <div class="sm:col-span-2">
                <dt class="text-brand-latte">{{ t('claimProofLabel') }}</dt>
                <dd class="text-brand-mocha whitespace-pre-line break-words">{{ claim.proof }}</dd>
              </div>
              <div v-if="claim.linkedLostItem" class="sm:col-span-2">
                <dt class="text-brand-latte">{{ t('claimLinkedLostPostStaffLabel') }}</dt>
                <dd class="mt-1 flex flex-wrap items-center gap-2">
                  <span class="font-semibold text-brand-espresso">{{ isTh ? claim.linkedLostItem.titleTh : claim.linkedLostItem.titleEn }}</span>
                  <button
                    type="button"
                    @click="$emit('view-item', claim.linkedLostItem)"
                    class="rounded-lg border border-brand-sand bg-brand-cream px-2.5 py-1 text-[11px] font-bold text-brand-chestnut transition-colors hover:bg-brand-sand"
                  >
                    {{ t('claimLinkedLostPostOpen') }}
                  </button>
                </dd>
              </div>
              <div v-if="claim.evidenceImageUrls.length" class="sm:col-span-2">
                <dt class="text-brand-latte">{{ t('claimEvidenceStaffLabel') }}</dt>
                <dd class="mt-1 flex flex-wrap gap-2">
                  <a v-for="(imageUrl, index) in claim.evidenceImageUrls" :key="imageUrl" :href="imageUrl" target="_blank" rel="noopener noreferrer" class="block overflow-hidden rounded-lg border border-brand-sand focus:outline-none focus:ring-2 focus:ring-brand-caramel">
                    <img :src="imageUrl" :alt="`${t('claimEvidenceStaffLabel')} ${index + 1}`" class="h-16 w-16 object-cover" />
                  </a>
                </dd>
              </div>
              <div v-if="claim.staffNote" class="sm:col-span-2">
                <dt class="text-brand-latte">{{ t('claimStaffNoteLabel') }}</dt>
                <dd class="text-brand-mocha">{{ claim.staffNote }}</dd>
              </div>
            </dl>
            <p class="text-[11px] text-brand-latte">{{ formatDateTime(claim.createdAt, isTh) }}</p>

            <div
              v-if="claim.status === 'pending' || claim.status === 'approved'"
              class="pt-3 border-t border-brand-sand/60 flex flex-col sm:flex-row sm:items-center gap-2.5"
            >
              <!-- Keyed by status as well, so the note clears once the claim moves on. -->
              <input
                v-model="claimNotes[`${claim.id}:${claim.status}`]"
                type="text"
                maxlength="300"
                :placeholder="t('claimNotePlaceholder')"
                :aria-label="t('claimNotePlaceholder')"
                class="flex-1 min-w-0 px-3 py-2 rounded-xl border border-brand-sand bg-brand-cream/40 text-xs text-brand-espresso focus:outline-none focus:ring-2 focus:ring-brand-caramel"
              />
              <div class="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  :disabled="busyClaimId !== null"
                  @click="reviewClaim(claim, 'rejected')"
                  class="px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-wait"
                >
                  {{ t('claimBtnReject') }}
                </button>
                <button
                  v-if="claim.status === 'pending'"
                  type="button"
                  :disabled="busyClaimId !== null"
                  @click="reviewClaim(claim, 'approved')"
                  class="px-4 py-2 rounded-xl bg-found hover:bg-found-dark text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-wait"
                >
                  <CheckCircle2 class="w-4 h-4" />
                  <span>{{ t('claimBtnApprove') }}</span>
                </button>
                <button
                  v-else
                  type="button"
                  :disabled="busyClaimId !== null"
                  @click="reviewClaim(claim, 'completed')"
                  class="px-4 py-2 rounded-xl bg-brand-chestnut hover:bg-brand-mocha text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-wait"
                >
                  <CheckSquare class="w-4 h-4" />
                  <span>{{ t('claimBtnComplete') }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- SECTION 2: ACTIVE ITEMS & HANDOVER RETURN   -->
      <!-- ========================================== -->
      <div v-else-if="activeSection === 'active'" class="space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-xl font-extrabold text-brand-espresso tracking-tight">
              {{ isTh ? 'จัดการรายการทั้งหมดและส่งมอบคืนสิ่งของ' : 'Active Items & Handover Management' }}
            </h2>
            <p class="text-xs text-brand-mocha/80 mt-0.5">
              {{ isTh ? 'บันทึกการส่งมอบคืนสิ่งของ ณ จุดบริการทางการ ตรวจสอบหลักฐาน และเปลี่ยนสถานะรายการ' : 'Confirm return handover and case closures.' }}
            </p>
          </div>
        </div>

        <!-- Search & Status Filter Controls -->
        <div class="p-4 sm:p-5 rounded-3xl bg-brand-paper border border-brand-sand shadow-warm-xs flex flex-col sm:flex-row items-center gap-3.5">
          <div class="relative flex-1 w-full">
            <Search class="w-4 h-4 text-brand-latte absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              v-model="activeSearchQuery"
              type="text"
              :placeholder="isTh ? 'ค้นหาชื่อสิ่งของ, รหัส #item, ผู้แจ้ง, สถานที่...' : 'Search by title, ID, reporter, location...'"
              class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-sand text-xs text-brand-espresso placeholder-brand-latte focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-caramel/40"
            />
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <select
              v-model="activeStatusFilter"
              class="px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-sand text-xs font-bold text-brand-espresso focus:bg-white focus:outline-hidden cursor-pointer"
            >
              <option value="all">{{ isTh ? 'ทุกสถานะ' : 'All Statuses' }}</option>
              <option value="searching">{{ isTh ? 'กำลังตามหา (Searching)' : 'Searching' }}</option>
              <option value="pending_confirm">{{ isTh ? 'รอยืนยันสิทธิ์ (Pending Confirm)' : 'Pending Confirm' }}</option>
              <option value="matched">{{ isTh ? 'จับคู่แล้ว (Matched)' : 'Matched' }}</option>
              <option value="returned">{{ isTh ? 'ส่งคืนแล้ว (Returned)' : 'Returned' }}</option>
              <option value="closed">{{ isTh ? 'ปิดรายการแล้ว (Closed)' : 'Closed' }}</option>
            </select>
          </div>
        </div>

        <!-- Items Table / Grid with Crisp Proportions -->
        <div class="space-y-3.5 mt-1">
          <div 
            v-for="item in filteredActiveItems" 
            :key="item.id"
            class="p-4 sm:p-4.5 rounded-2xl bg-brand-paper border border-brand-sand shadow-warm-xs hover:shadow-warm-sm transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div class="flex items-center gap-3.5 min-w-0 flex-1">
              <img :src="item.imageUrl" alt="" class="w-12 h-12 rounded-xl object-cover border border-brand-sand/80 shrink-0 shadow-2xs" />
              <div class="min-w-0 space-y-1 flex-1">
                <div class="flex items-center gap-2">
                  <span 
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border"
                    :class="getStatusBadgeClass(item.status, item.type)"
                  >
                    {{ getStatusLabel(item.status, item.type) }}
                  </span>
                  <span class="font-mono text-xs text-brand-latte">#{{ item.id }}</span>
                </div>
                <h4 class="font-bold text-sm text-brand-espresso truncate">
                  {{ isTh ? item.titleTh : item.titleEn }}
                </h4>
                <p class="text-xs text-brand-mocha/80 truncate">
                  {{ item.colorNameTh ? `สี: ${item.colorNameTh} • ` : '' }}
                  {{ item.brand ? `ยี่ห้อ: ${item.brand} • ` : '' }}
                  {{ isTh ? item.locationDetailTh : item.locationDetailEn }}
                </p>
                <p class="text-xs text-brand-latte">
                  {{ isTh ? 'จุดส่งมอบ: ' : 'Handover Point: ' }}<span class="font-semibold text-brand-chestnut">{{ isTh ? item.handoverPointTh : item.handoverPointEn }}</span>
                </p>
              </div>
            </div>

            <!-- Handover Confirmation Action -->
            <div class="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end pt-2 sm:pt-0">
              <button
                v-if="item.status !== 'returned' && item.status !== 'closed'"
                type="button"
                :disabled="busyCloseItemId !== null"
                @click="openCloseConfirmModal(item)"
                class="px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-wait focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2"
              >
                <CircleX class="w-4 h-4" />
                <span>{{ isTh ? 'ปิดรายการ' : 'Close item' }}</span>
              </button>

              <button
                v-if="item.status !== 'returned' && item.status !== 'closed'"
                @click="openConfirmReturnModal(item)"
                class="px-4 py-2 rounded-xl bg-brand-chestnut hover:bg-brand-mocha text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-warm-xs cursor-pointer"
              >
                <ShieldCheck class="w-4 h-4" />
                <span>{{ t('staffBtnConfirmReturn') }}</span>
              </button>
              
              <div v-else-if="item.status === 'returned'" class="flex items-center gap-1.5 text-xs font-bold text-found bg-found-light/60 px-3.5 py-2 rounded-xl border border-found-border">
                <CheckCircle2 class="w-4 h-4 text-found" />
                <span>{{ t('statusReturned') }}</span>
              </div>

              <div v-else class="text-xs font-bold text-brand-latte bg-brand-sand/50 px-3.5 py-2 rounded-xl">
                {{ t('statusClosed') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- SECTION 3: STAFF AUDIT LOGS TRAIL          -->
      <!-- ========================================== -->
      <div v-else-if="activeSection === 'audit'" class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 class="text-xl font-extrabold text-brand-espresso tracking-tight">
              {{ t('staffAuditLogTitle') }}
            </h2>
            <p class="text-xs text-brand-mocha/80 mt-0.5">
              {{ t('staffAuditLogSubtitle') }}
            </p>
          </div>
          <span class="text-xs text-brand-mocha font-semibold bg-brand-paper px-3 py-1 rounded-xl border border-brand-sand">
            {{ isTh ? 'บันทึกประวัติทั้งหมด' : 'Total records' }}: {{ auditLogs.length }}
          </span>
        </div>

        <div class="rounded-3xl border border-brand-sand overflow-hidden bg-brand-paper shadow-warm-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead class="bg-brand-cream/80 text-brand-mocha border-b border-brand-sand font-bold">
                <tr>
                  <th class="py-3.5 px-4 font-semibold">{{ t('staffAuditColTime') }}</th>
                  <th class="py-3.5 px-4 font-semibold">{{ t('staffAuditColStaff') }}</th>
                  <th class="py-3.5 px-4 font-semibold">{{ t('staffAuditColAction') }}</th>
                  <th class="py-3.5 px-4 font-semibold">{{ t('staffAuditColItem') }}</th>
                  <th class="py-3.5 px-4 font-semibold">{{ t('staffAuditColDetails') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-brand-sand/60">
                <tr v-if="auditLogs.length === 0">
                  <td colspan="5" class="py-10 px-4 text-center text-brand-latte">{{ t('staffAuditEmpty') }}</td>
                </tr>
                <tr v-for="log in auditLogs" :key="log.id" class="hover:bg-brand-cream/40 transition-colors">
                  <td class="py-3 px-4 font-mono tabular-nums text-[11px] text-brand-latte whitespace-nowrap">
                    {{ formatLogTime(log.timestamp) }}
                  </td>
                  <td class="py-3 px-4 font-bold text-brand-espresso whitespace-nowrap">
                    {{ log.staffName }}
                  </td>
                  <td class="py-3 px-4 whitespace-nowrap">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border" :class="log.statusBadgeClass || 'bg-brand-cream text-brand-chestnut border-brand-sand'">
                      {{ isTh ? log.actionLabelTh : log.actionLabelEn }}
                    </span>
                  </td>
                  <td class="py-3 px-4 font-semibold text-brand-espresso">
                    <span class="text-brand-latte font-mono text-[10px] block">#{{ log.itemId }}</span>
                    <span class="line-clamp-1">{{ log.itemTitle }}</span>
                  </td>
                  <td class="py-3 px-4 text-brand-mocha text-[11px] max-w-sm">
                    <p class="font-medium text-brand-espresso">{{ log.claimantInfo }}</p>
                    <p class="text-brand-latte line-clamp-2 mt-0.5">{{ log.notes }}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- SECTION 4: MATCHING ACCURACY BENCHMARK      -->
      <!-- ========================================== -->
      <div v-else-if="activeSection === 'benchmark'" class="space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-brand-paper border border-brand-sand shadow-warm-sm">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-extrabold text-brand-espresso">
                {{ isTh ? 'การทดสอบประสิทธิภาพของระบบจับคู่ (Matching Accuracy Benchmark)' : 'Matching Accuracy Benchmark' }}
              </h2>
            </div>
            <p class="text-xs text-brand-mocha/80 mt-1 max-w-2xl leading-relaxed">
              {{ isTh ? 'รันการทดสอบด้วยชุดข้อมูลตัวอย่าง 10 กรณีศึกษา (5 True Matches, 5 Non-Matches) โดยใช้อัลกอริทึม 5 ปัจจัย (หมวดหมู่ 30%, สี 20%, สถานที่ 20%, เวลา 15%, คำค้น/ยี่ห้อ 15%) และเกณฑ์คะแนน >= 60%' : 'Evaluates matching engine precision and recall against ground truth dataset.' }}
            </p>
          </div>

          <button
            @click="handleRunBenchmark"
            class="px-4 py-2.5 rounded-xl bg-brand-chestnut hover:bg-brand-mocha text-white text-xs font-bold transition-all shadow-warm-xs flex items-center gap-2 shrink-0 self-start sm:self-center cursor-pointer"
          >
            <RotateCcw class="w-4 h-4" />
            <span>{{ t('btnRunBenchmark') }}</span>
          </button>
        </div>

        <!-- Metric cards use the shared Kanit type system -->
        <div v-if="benchmarkResults" class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="p-5 rounded-3xl bg-brand-paper border border-brand-sand text-center shadow-warm-xs">
            <span class="text-[11px] font-bold text-brand-latte block uppercase tracking-wider mb-1">
              {{ t('evalMetricAccuracy') }}
            </span>
            <span class="text-3xl sm:text-4xl font-extrabold text-found font-sans tracking-tight">
              {{ benchmarkResults.accuracy }}%
            </span>
            <span class="text-[10px] text-brand-mocha/70 block mt-1">
              ({{ benchmarkResults.truePositives + benchmarkResults.trueNegatives }}/{{ benchmarkResults.total }} {{ isTh ? 'ถูกต้องทั้งหมด' : 'correct' }})
            </span>
          </div>

          <div class="p-5 rounded-3xl bg-brand-paper border border-brand-sand text-center shadow-warm-xs">
            <span class="text-[11px] font-bold text-brand-latte block uppercase tracking-wider mb-1">
              {{ t('evalMetricPrecision') }}
            </span>
            <span class="text-3xl sm:text-4xl font-extrabold text-brand-espresso font-sans tracking-tight">
              {{ benchmarkResults.precision }}%
            </span>
            <span class="text-[10px] text-brand-mocha/70 block mt-1">TP / (TP + FP)</span>
          </div>

          <div class="p-5 rounded-3xl bg-brand-paper border border-brand-sand text-center shadow-warm-xs">
            <span class="text-[11px] font-bold text-brand-latte block uppercase tracking-wider mb-1">
              {{ t('evalMetricRecall') }}
            </span>
            <span class="text-3xl sm:text-4xl font-extrabold text-brand-espresso font-sans tracking-tight">
              {{ benchmarkResults.recall }}%
            </span>
            <span class="text-[10px] text-brand-mocha/70 block mt-1">TP / (TP + FN)</span>
          </div>

          <div class="p-5 rounded-3xl bg-brand-paper border border-brand-sand text-center shadow-warm-xs">
            <span class="text-[11px] font-bold text-brand-latte block uppercase tracking-wider mb-1">
              {{ t('evalMetricAvgScore') }}
            </span>
            <span class="text-3xl sm:text-4xl font-extrabold text-brand-chestnut font-sans tracking-tight">
              {{ benchmarkResults.avgMatchedScore }}%
            </span>
            <span class="text-[10px] text-brand-mocha/70 block mt-1">{{ isTh ? 'คะแนนเฉลี่ยคู่ที่ตรงจริง' : 'True match avg score' }}</span>
          </div>
        </div>

        <!-- Confusion Matrix Section -->
        <div v-if="benchmarkResults" class="p-6 rounded-3xl bg-brand-paper border border-brand-sand shadow-warm-xs space-y-3">
          <h3 class="font-bold text-sm text-brand-espresso">
            {{ isTh ? 'ตาราง Confusion Matrix (การประเมินจำแนกประเภท):' : 'Confusion Matrix Evaluation:' }}
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div class="p-4 rounded-2xl bg-found-light/70 border border-found-border text-found-dark">
              <span class="font-extrabold block text-base">True Positive: {{ benchmarkResults.truePositives }}</span>
              <span class="text-[11px] text-found-dark/80 mt-0.5 block">คู่ตรงจริง และระบบจับคู่สำเร็จ (Score >= 60%)</span>
            </div>
            <div class="p-4 rounded-2xl bg-match-light/70 border border-match-border text-match-dark">
              <span class="font-extrabold block text-base">True Negative: {{ benchmarkResults.trueNegatives }}</span>
              <span class="text-[11px] text-match-dark/80 mt-0.5 block">คนละสิ่งของ และระบบไม่จับคู่ (Score < 60%)</span>
            </div>
            <div class="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900">
              <span class="font-extrabold block text-base">False Positive: {{ benchmarkResults.falsePositives }}</span>
              <span class="text-[11px] text-rose-700 mt-0.5 block">คนละสิ่งของ แต่ระบบจับคู่ผิดพลาด</span>
            </div>
            <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
              <span class="font-extrabold block text-base">False Negative: {{ benchmarkResults.falseNegatives }}</span>
              <span class="text-[11px] text-amber-700 mt-0.5 block">คู่ตรงจริง แต่ระบบคะแนนไม่ถึงเกณฑ์</span>
            </div>
          </div>
        </div>

        <!-- Benchmark Test Cases Table with 5-factor breakdown -->
        <div v-if="benchmarkResults" class="rounded-3xl border border-brand-sand overflow-hidden bg-brand-paper shadow-warm-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead class="bg-brand-cream/80 text-brand-mocha border-b border-brand-sand font-bold">
                <tr>
                  <th class="py-3.5 px-4">กรณีทดสอบ (Ground Truth Case)</th>
                  <th class="py-3.5 px-4">เป้าหมายจริง</th>
                  <th class="py-3.5 px-4">คะแนนระบบ</th>
                  <th class="py-3.5 px-4">แจกแจง 5 ปัจจัย (หมวด 30 / สี 20 / ที่ 20 / วัน 15 / คำ 15)</th>
                  <th class="py-3.5 px-4">ผลการจำแนก</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-brand-sand/60">
                <tr v-for="res in benchmarkResults.detailedResults" :key="res.id" class="hover:bg-brand-cream/40 transition-colors">
                  <td class="py-3 px-4 font-semibold text-brand-espresso max-w-xs">
                    <div>{{ res.caseTitleTh }}</div>
                    <div class="text-[10px] text-brand-latte mt-0.5 line-clamp-1">{{ res.expectedReasonTh }}</div>
                  </td>
                  <td class="py-3 px-4 whitespace-nowrap">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold" :class="res.expectedMatch ? 'bg-found-light text-found-dark' : 'bg-brand-sand text-brand-mocha'">
                      {{ res.expectedMatch ? 'ตรงกัน (Match)' : 'ไม่ตรง (Non-Match)' }}
                    </span>
                  </td>
                  <td class="py-3 px-4 whitespace-nowrap font-extrabold text-sm text-brand-espresso tabular-nums">
                    {{ res.score }}%
                  </td>
                  <td class="py-3 px-4 font-mono tabular-nums text-[11px] text-brand-mocha whitespace-nowrap">
                    <span class="font-semibold text-brand-espresso">หมวด: {{ res.breakdown.categoryScore }}</span> | 
                    <span>สี: {{ res.breakdown.colorScore }}</span> | 
                    <span>ที่: {{ res.breakdown.locationScore }}</span> | 
                    <span>วัน: {{ res.breakdown.dateScore }}</span> | 
                    <span>คำ: {{ res.breakdown.textScore }}</span>
                  </td>
                  <td class="py-3 px-4 whitespace-nowrap">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold" :class="res.isCorrect ? 'bg-found-light text-found-dark border border-found-border' : 'bg-rose-100 text-rose-800 border border-rose-300'">
                      {{ res.isCorrect ? '✓ ถูกต้อง' : '✗ คลาดเคลื่อน' }} ({{ res.outcome }})
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- SECTION 5: USER SATISFACTION SURVEY        -->
      <!-- ========================================== -->
      <div v-else-if="activeSection === 'survey'" class="space-y-5">
        <div class="p-6 rounded-3xl bg-brand-paper border border-brand-sand shadow-warm-sm space-y-1.5">
          <div class="flex items-center gap-2">
            <h2 class="text-lg font-extrabold text-brand-espresso">
              {{ isTh ? 'แบบประเมินความพึงพอใจของผู้ใช้งานระบบ (User Satisfaction Survey)' : 'User Satisfaction Evaluation' }}
            </h2>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-found-light text-found-dark border border-found-border font-mono">
              ISO 9241-210
            </span>
          </div>
          <p class="text-xs text-brand-mocha/80 leading-relaxed max-w-3xl">
            {{ isTh ? 'ประเมิน 4 มิติตามมาตรฐานสากล ISO 9241-210: 1. ความง่ายในการใช้งาน, 2. ความชัดเจนของข้อมูล, 3. ความรวดเร็วในการแจ้งเตือน, และ 4. ประโยชน์และความคุ้มค่าในการใช้งานจริงในมหาวิทยาลัย' : 'Evaluates Ease of Use, Clarity, Speed, and Practical Value.' }}
          </p>
        </div>

        <!-- Real answers live in the team's Google Form; the ratings below are demo data -->
        <div
          v-if="backendConfigured"
          class="p-6 rounded-3xl bg-brand-paper border border-brand-sand shadow-warm-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div class="space-y-1 max-w-xl">
            <h3 class="font-bold text-sm text-brand-espresso">{{ t('surveyFormTitle') }}</h3>
            <p class="text-xs text-brand-mocha/80 leading-relaxed">{{ t('surveyFormBody') }}</p>
          </div>
          <a
            :href="SATISFACTION_SURVEY_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-chestnut hover:bg-brand-mocha text-white text-xs font-bold shadow-warm-xs transition-colors self-start sm:self-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-caramel focus-visible:ring-offset-2"
          >
            <ExternalLink class="w-4 h-4" />
            <span>{{ t('surveyFormOpen') }}</span>
          </a>
        </div>

        <template v-else>
        <!-- 4 Question Cards with Lucide Star icons -->
        <div class="space-y-4">
          <div 
            v-for="(q, idx) in surveyQuestions" 
            :key="q.id"
            class="p-5 rounded-3xl bg-brand-paper border border-brand-sand shadow-warm-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div class="max-w-xl space-y-1">
              <span class="text-[10px] font-bold text-brand-caramel uppercase tracking-wider block">
                มิติที่ {{ idx + 1 }} • {{ q.categoryTh }}
              </span>
              <h4 class="font-bold text-sm text-brand-espresso leading-snug">
                {{ isTh ? q.questionTh : q.questionEn }}
              </h4>
              <p class="text-xs text-brand-mocha/70">
                {{ isTh ? q.descTh : q.descEn }}
              </p>
            </div>

            <!-- Star Rating with Hover & Clean SVG icons -->
            <div class="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
              <button
                v-for="score in 5"
                :key="score"
                @click="q.rating = score"
                type="button"
                class="w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer border"
                :class="q.rating >= score ? 'bg-amber-400 text-white border-amber-500 shadow-warm-xs scale-105' : 'bg-brand-cream/60 hover:bg-brand-sand text-brand-latte border-brand-sand'"
                :title="`ให้คะแนน ${score}/5`"
              >
                <Star class="w-4 h-4 fill-current" />
              </button>
              <span class="text-xs font-bold text-brand-espresso ml-2 w-8 text-right font-mono">
                {{ q.rating }}/5
              </span>
            </div>
          </div>
        </div>

        <!-- Overall Score Card -->
        <div class="p-6 rounded-3xl bg-[#261B13] text-white shadow-warm-md flex flex-col sm:flex-row sm:items-center justify-between gap-5 border border-brand-espresso/30">
          <div>
            <span class="text-xs text-[#C4B3A5] block">
              {{ isTh ? 'คะแนนความพึงพอใจเฉลี่ยโดยรวม (Overall Average Rating):' : 'Overall Average Rating:' }}
            </span>
            <div class="flex items-baseline gap-3 mt-1">
              <span class="text-3xl sm:text-4xl font-extrabold text-amber-400 font-sans tracking-tight">
                {{ surveyAverage }} / 5.00
              </span>
              <span class="text-xs font-semibold text-found-light">
                ({{ surveyAverageText }})
              </span>
            </div>
          </div>

          <button
            @click="submitSurveyFeedback"
            class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-caramel to-brand-chestnut hover:from-brand-chestnut hover:to-brand-mocha text-white text-xs font-bold shadow-warm-sm transition-all self-start sm:self-auto cursor-pointer"
          >
            {{ isTh ? 'บันทึกผลการประเมินลงรายงาน' : 'Record Evaluation' }}
          </button>
        </div>
        </template>
      </div>

    </main>

    <!-- Inspection Details Modal for Staff Review -->
    <div v-if="inspectingItem" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-espresso/70 backdrop-blur-md animate-in fade-in duration-150">
      <div class="bg-brand-paper rounded-3xl p-6 border border-brand-sand max-w-xl w-full shadow-warm-xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-brand-sand pb-3">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-lost-light text-lost-dark">
              {{ inspectingItem.type === 'lost' ? t('badgeLost') : t('badgeFound') }}
            </span>
            <span class="font-mono text-xs text-brand-latte">#{{ inspectingItem.id }}</span>
          </div>
          <button @click="inspectingItem = null" class="text-brand-latte hover:text-brand-espresso text-lg font-bold">✕</button>
        </div>

        <div class="w-full h-48 rounded-2xl overflow-hidden bg-brand-sand/40 border border-brand-tan/50">
          <img :src="inspectingItem.imageUrl" alt="" class="w-full h-full object-cover" />
        </div>

        <div>
          <h3 class="font-extrabold text-base text-brand-espresso">
            {{ isTh ? inspectingItem.titleTh : inspectingItem.titleEn }}
          </h3>
          <p class="text-xs text-brand-mocha/80 mt-1 leading-relaxed">
            {{ isTh ? inspectingItem.descriptionTh : inspectingItem.descriptionEn }}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-2.5 text-xs bg-brand-cream/60 p-3.5 rounded-2xl border border-brand-sand">
          <div>
            <span class="text-[10px] text-brand-latte block">สี (Color)</span>
            <strong class="text-brand-espresso">{{ inspectingItem.colorNameTh || inspectingItem.color || '-' }}</strong>
          </div>
          <div>
            <span class="text-[10px] text-brand-latte block">ยี่ห้อ (Brand)</span>
            <strong class="text-brand-espresso">{{ inspectingItem.brand || '-' }}</strong>
          </div>
          <div>
            <span class="text-[10px] text-brand-latte block">สถานที่ (Location)</span>
            <strong class="text-brand-espresso">{{ isTh ? inspectingItem.locationDetailTh : inspectingItem.locationDetailEn }}</strong>
          </div>
          <div>
            <span class="text-[10px] text-brand-latte block">จุดส่งมอบ (Handover Point)</span>
            <strong class="text-brand-chestnut">{{ isTh ? inspectingItem.handoverPointTh : inspectingItem.handoverPointEn }}</strong>
          </div>
        </div>

        <div v-if="inspectingItem.distinctiveMarks" class="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900">
          <strong>จุดสังเกตเฉพาะ:</strong> {{ inspectingItem.distinctiveMarks }}
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-brand-sand/60">
          <button 
            @click="handleReject(inspectingItem); inspectingItem = null" 
            class="px-4 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors cursor-pointer"
          >
            {{ t('staffBtnReject') }}
          </button>
          <button
            @click="handleApprove(inspectingItem); inspectingItem = null"
            :disabled="busyItemId !== null"
            class="px-5 py-2 rounded-xl bg-found hover:bg-found-dark text-white text-xs font-bold transition-colors shadow-warm-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 class="w-4 h-4" />
            <span>{{ t('staffBtnApprove') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Close Item Confirmation Modal -->
    <div v-if="closeConfirmItem" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-espresso/70 backdrop-blur-md animate-in fade-in duration-150" @click.self="closeConfirmItem = null">
      <div class="bg-brand-paper rounded-3xl p-6 border border-brand-sand max-w-md w-full shadow-warm-xl">
        <div class="flex items-start gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center justify-center shrink-0">
            <CircleX class="w-5 h-5" />
          </div>
          <div class="min-w-0">
            <h3 class="text-lg font-extrabold text-brand-espresso">
              {{ isTh ? 'ยืนยันการปิดรายการ' : 'Close this item?' }}
            </h3>
            <p class="mt-1 text-xs leading-relaxed text-brand-mocha/80">
              {{ isTh ? `รายการ “${closeConfirmItem.titleTh}” จะเปลี่ยนเป็น “ปิดรายการแล้ว” และจะไม่แสดงในหน้าหลัก` : `“${closeConfirmItem.titleEn}” will be marked closed and removed from the home page.` }}
            </p>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2.5 mt-6">
          <button
            type="button"
            @click="closeConfirmItem = null"
            class="px-4 py-2 rounded-xl text-xs font-semibold text-brand-mocha hover:bg-brand-cream transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-caramel"
          >
            {{ isTh ? 'ยกเลิก' : 'Cancel' }}
          </button>
          <button
            type="button"
            :disabled="busyCloseItemId !== null"
            @click="executeCloseItem"
            class="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-wait focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2"
          >
            <CircleX class="w-4 h-4" />
            <span>{{ isTh ? 'ยืนยันปิดรายการ' : 'Confirm close' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Return Handover Modal with Clean Warm Design -->
    <div v-if="returnConfirmItem" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-espresso/70 backdrop-blur-md animate-in fade-in duration-150">
      <div class="bg-brand-paper rounded-3xl p-6 border border-brand-sand max-w-md w-full shadow-warm-xl space-y-4">
        <div class="flex items-center gap-2.5 border-b border-brand-sand pb-3">
          <div class="w-8 h-8 rounded-xl bg-found-light text-found-dark flex items-center justify-center">
            <ShieldCheck class="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 class="font-bold text-sm text-brand-espresso">
              {{ isTh ? 'ยืนยันการส่งมอบคืนสิ่งของ' : 'Confirm Return Handover' }}
            </h4>
            <span class="font-mono text-[10px] text-brand-latte">#{{ returnConfirmItem.id }}</span>
          </div>
        </div>

        <p class="text-xs text-brand-mocha">
          {{ isTh ? 'รายการ: ' : 'Item: ' }}<strong class="text-brand-espresso">{{ isTh ? returnConfirmItem.titleTh : returnConfirmItem.titleEn }}</strong>
        </p>

        <div>
          <label class="block text-xs font-bold text-brand-espresso mb-1">
            {{ isTh ? 'ข้อมูลผู้รับมอบคืน (ชื่อ-นามสกุล / รหัสนักศึกษา)' : 'Claimant Name & Student ID' }}
          </label>
          <input 
            v-model="returnClaimant" 
            type="text" 
            placeholder="เช่น นายธนภัทร 6530xxx-x" 
            class="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-sand text-xs text-brand-espresso focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-caramel/40"
          />
        </div>

        <div>
          <label class="block text-xs font-bold text-brand-espresso mb-1">
            {{ isTh ? 'หมายเหตุ / หลักฐานที่ตรวจสอบ' : 'Verification Notes' }}
          </label>
          <textarea 
            v-model="returnNotes" 
            rows="2" 
            placeholder="เช่น ตรวจสอบบัตรนักศึกษาตรงกับข้อมูล ปลดล็อกหน้าจอโทรศัพท์ได้ถูกต้อง"
            class="w-full px-3.5 py-2.5 rounded-xl bg-brand-cream/60 border border-brand-sand text-xs text-brand-espresso focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-brand-caramel/40"
          ></textarea>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-2">
          <button 
            @click="returnConfirmItem = null" 
            class="px-4 py-2 rounded-xl text-xs font-semibold text-brand-mocha hover:bg-brand-cream/80 transition-colors cursor-pointer"
          >
            {{ isTh ? 'ยกเลิก' : 'Cancel' }}
          </button>
          <button 
            @click="executeReturnConfirm" 
            class="px-4 py-2 rounded-xl bg-found hover:bg-found-dark text-white text-xs font-bold shadow-warm-xs transition-all cursor-pointer"
          >
            {{ isTh ? 'บันทึกส่งคืน & บันทึก Audit Log' : 'Save & Record Audit' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  ShieldCheck, ArrowLeft, Inbox, CheckSquare, FileText, 
  Zap, Smile, CheckCircle2, RotateCcw, Search, Star, ExternalLink, CircleX
} from 'lucide-vue-next'
import { SATISFACTION_SURVEY_URL } from '../data/links'
import { runMatchingBenchmark } from '../data/benchmarkDataset'
import { calculatePairScore } from '../utils/matchingEngine'
import { CLAIM_STATUS_CLASSES, CLAIM_STATUS_KEYS, formatDateTime } from '../utils/claimStatus'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  auditLogs: {
    type: Array,
    required: true
  },
  currentLang: {
    type: String,
    default: 'th'
  },
  t: {
    type: Function,
    required: true
  },
  // Claims only exist with a backend; the demo tracks them on the item instead,
  // and the demo alone may reset its mock data.
  backendConfigured: { type: Boolean, default: false },
  claims: { type: Array, default: () => [] },
  busyClaimId: { type: String, default: null },
  // The item being approved right now; its buttons wait for the answer.
  busyItemId: { type: String, default: null },
  busyCloseItemId: { type: String, default: null }
})

const emit = defineEmits([
  'navigate-home',
  'lang-change',
  'approve-item',
  'reject-item',
  'close-item',
  'confirm-return',
  'reset-data',
  'review-claim',
  'view-item'
])

const isTh = computed(() => props.currentLang === 'th')
const activeSection = ref('pending')

// Open claims first, newest first within each status.
const CLAIM_ORDER = { pending: 0, approved: 1, rejected: 2, completed: 3 }
const sortedClaims = computed(() =>
  [...props.claims].sort((a, b) =>
    (CLAIM_ORDER[a.status] - CLAIM_ORDER[b.status]) || (new Date(b.createdAt) - new Date(a.createdAt))
  )
)
const pendingClaimCount = computed(() => props.claims.filter(c => c.status === 'pending').length)
const openClaimCount = computed(() => props.claims.filter(c => c.status === 'pending' || c.status === 'approved').length)
const claimNotes = ref({})

function reviewClaim(claim, decision) {
  emit('review-claim', { claimId: claim.id, decision, note: claimNotes.value[`${claim.id}:${claim.status}`] || '' })
}

// Computed subsets
const pendingItems = computed(() => {
  return props.items.filter(i => i.status === 'pending_review')
})

const activeItems = computed(() => {
  return props.items.filter(i => i.status !== 'pending_review')
})

const searchingCount = computed(() => {
  return props.items.filter(i => i.status === 'searching').length
})

const returnedCount = computed(() => {
  return props.items.filter(i => i.status === 'returned').length
})

// Share of published items that went home; null until something is published.
const returnRate = computed(() => {
  const published = props.items.filter(i => ['searching', 'pending_confirm', 'returned'].includes(i.status)).length
  return published === 0 ? null : ((returnedCount.value / published) * 100).toFixed(1)
})

// Search & Filter in Active Items
const activeSearchQuery = ref('')
const activeStatusFilter = ref('all')

const filteredActiveItems = computed(() => {
  let result = [...activeItems.value]

  if (activeStatusFilter.value !== 'all') {
    result = result.filter(item => item.status === activeStatusFilter.value)
  }

  if (activeSearchQuery.value.trim()) {
    const q = activeSearchQuery.value.toLowerCase().trim()
    result = result.filter(item => 
      (item.titleTh && item.titleTh.toLowerCase().includes(q)) ||
      (item.titleEn && item.titleEn.toLowerCase().includes(q)) ||
      (item.id && item.id.toLowerCase().includes(q)) ||
      (item.reporterName && item.reporterName.toLowerCase().includes(q)) ||
      (item.locationDetailTh && item.locationDetailTh.toLowerCase().includes(q))
    )
  }

  return result
})

// Inspection & Return Modals
const inspectingItem = ref(null)
const returnConfirmItem = ref(null)
const closeConfirmItem = ref(null)
const returnClaimant = ref('')
const returnNotes = ref('')

function openInspectModal(item) {
  inspectingItem.value = item
}

function openConfirmReturnModal(item) {
  returnConfirmItem.value = item
  returnClaimant.value = ''
  returnNotes.value = 'ตรวจสอบหลักฐานยืนยันตัวตนเรียบร้อย ณ จุดส่งมอบทางการ'
}

function openCloseConfirmModal(item) {
  closeConfirmItem.value = item
}

function executeCloseItem() {
  if (!closeConfirmItem.value || props.busyCloseItemId !== null) return
  emit('close-item', closeConfirmItem.value.id)
  closeConfirmItem.value = null
}

function executeReturnConfirm() {
  if (!returnConfirmItem.value) return
  emit('confirm-return', {
    itemId: returnConfirmItem.value.id,
    itemTitle: returnConfirmItem.value.titleTh,
    claimant: returnClaimant.value || 'นิสิตผู้เป็นเจ้าของ',
    notes: returnNotes.value || 'ส่งมอบคืนเรียบร้อย'
  })
  returnConfirmItem.value = null
}

function handleReset() {
  activeSearchQuery.value = ''
  activeStatusFilter.value = 'all'
  inspectingItem.value = null
  returnConfirmItem.value = null
  closeConfirmItem.value = null
  emit('reset-data')
}

function handleApprove(item) {
  emit('approve-item', item.id)
}

function handleReject(item) {
  emit('reject-item', item.id)
}

function getStatusBadgeClass(status, type) {
  if (status === 'pending_review') return 'bg-amber-100 text-amber-900 border-amber-300'
  if (status === 'pending_confirm') return 'bg-purple-100 text-purple-900 border-purple-300'
  if (status === 'matched') return 'bg-match-light text-match-dark border-match-border'
  if (status === 'returned') return 'bg-found-light text-found-dark border-found-border'
  if (status === 'closed') return 'bg-brand-sand text-brand-mocha border-brand-tan'
  if (type === 'lost') return 'bg-lost-light text-lost-dark border-lost-border'
  return 'bg-found-light text-found-dark border-found-border'
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

function formatLogTime(isoStr) {
  if (!isoStr) return ''
  const d = new Date(isoStr)
  return d.toLocaleString('th-TH', { 
    month: 'short', day: 'numeric', 
    hour: '2-digit', minute: '2-digit' 
  })
}

// Evaluation Suite state
const benchmarkResults = ref(null)

onMounted(() => {
  handleRunBenchmark()
})

function handleRunBenchmark() {
  benchmarkResults.value = runMatchingBenchmark(calculatePairScore, 60)
}

const surveyQuestions = ref([
  {
    id: 'sq-1',
    categoryTh: 'ด้านความง่ายในการใช้งาน (Ease of Use)',
    questionTh: 'ระบบมีการจัดวางหน้าจอ ขั้นตอนการแจ้งข้อมูล และค้นหาได้อย่างสะดวก เข้าใจง่าย',
    questionEn: 'The system has an intuitive layout, streamlined reporting, and easy navigation.',
    descTh: 'ประเมินความสะดวกในการบันทึกข้อมูลและค้นหาย้อนหลัง',
    descEn: 'Evaluate convenience of entering data and searching',
    rating: 5
  },
  {
    id: 'sq-2',
    categoryTh: 'ด้านความชัดเจนของข้อมูล (Clarity of Information)',
    questionTh: 'ข้อมูลรายละเอียดสิ่งของ สี ยี่ห้อ จุดสังเกต และสถานที่ มีความครบถ้วนชัดเจน',
    questionEn: 'Item details, color, brand, distinctive marks, and locations are clear and comprehensive.',
    descTh: 'ประเมินการแสดงผลข้อมูล 5 มิติในการระบุตัวตนสิ่งของ',
    descEn: 'Evaluate the 5-factor presentation for identification',
    rating: 5
  },
  {
    id: 'sq-3',
    categoryTh: 'ด้านความรวดเร็ว (Speed of Processing & Alerts)',
    questionTh: 'ระบบประมวลผลจับคู่สิ่งของที่ตรงกันได้แบบทันที (Real-time) และแจ้งเตือนรวดเร็ว',
    questionEn: 'The matching engine computes compatible items in real-time and alerts swiftly.',
    descTh: 'ประเมินความฉับไวในการส่งการแจ้งเตือนทางอีเมล',
    descEn: 'Evaluate responsiveness of email alerts',
    rating: 4
  },
  {
    id: 'sq-4',
    categoryTh: 'ด้านประโยชน์ของระบบ (Usefulness & Value)',
    questionTh: 'ระบบช่วยลดปัญหาการตามหาของหายในมหาวิทยาลัย และเพิ่มโอกาสการได้รับของคืนอย่างมีนัยสำคัญ',
    questionEn: 'The platform significantly reduces coordination friction and enhances item recovery rates.',
    descTh: 'ประเมินคุณค่าในการนำไปใช้งานจริงในมหาวิทยาลัย',
    descEn: 'Evaluate practical campus impact and return effectiveness',
    rating: 5
  }
])

const surveyAverage = computed(() => {
  const sum = surveyQuestions.value.reduce((acc, q) => acc + q.rating, 0)
  return (sum / surveyQuestions.value.length).toFixed(2)
})

const surveyAverageText = computed(() => {
  const avg = parseFloat(surveyAverage.value)
  if (avg >= 4.5) return 'ระดับความพึงพอใจมากที่สุด (Highest)'
  if (avg >= 3.5) return 'ระดับความพึงพอใจมาก (High)'
  if (avg >= 2.5) return 'ระดับความพึงพอใจปานกลาง (Moderate)'
  return 'ควรปรับปรุง (Needs Improvement)'
})

function submitSurveyFeedback() {
  const surveySummary = `คะแนนเฉลี่ย: ${surveyAverage.value} / 5.00 (${surveyAverageText.value})`
  // Clean in-UI notification instead of blocking alert
  const banner = document.createElement('div')
  banner.className = 'fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#261B13] text-white text-xs font-bold shadow-warm-lg flex items-center gap-2 border border-brand-caramel/40 animate-in fade-in slide-in-from-bottom-2 duration-200'
  const dot = document.createElement('span')
  dot.className = 'w-2 h-2 rounded-full bg-found'
  const message = document.createElement('span')
  message.textContent = `บันทึกผลการประเมินความพึงพอใจเรียบร้อยแล้ว (${surveySummary})`
  banner.append(dot, message)
  document.body.appendChild(banner)
  setTimeout(() => banner.remove(), 4000)
}
</script>
