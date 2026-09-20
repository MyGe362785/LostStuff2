<template>
  <section class="py-12 border-t border-brand-sand/70 bg-brand-cream/55">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-cream text-brand-chestnut text-xs font-bold mb-3 border border-brand-sand uppercase tracking-wider">
          <HelpCircle class="w-4 h-4 text-brand-caramel" />
          <span>{{ isTh ? 'ข้อแนะนำ & ความปลอดภัย' : 'Safety & FAQ' }}</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-brand-espresso mb-2">
          {{ t('faqTitle') }}
        </h2>
      </div>

      <!-- FAQ Accordions -->
      <div class="space-y-2.5">
        
        <!-- FAQ 1 -->
        <div class="rounded-xl bg-brand-paper border border-brand-sand shadow-warm-sm overflow-hidden">
          <button 
            @click="toggleFaq(1)"
            class="w-full p-4 text-left font-bold text-xs sm:text-sm text-brand-espresso flex items-center justify-between gap-3 hover:bg-brand-cream/40 transition-colors"
          >
            <span class="flex items-center gap-2.5">
              <span class="w-5 h-5 rounded-md bg-brand-cream text-brand-chestnut flex items-center justify-center text-[11px] font-bold shrink-0 border border-brand-sand">1</span>
              {{ t('faq1Q') }}
            </span>
            <ChevronDown class="w-4 h-4 text-brand-latte transition-transform" :class="openFaq === 1 ? 'rotate-180 text-brand-chestnut' : ''" />
          </button>
          <div v-if="openFaq === 1" class="px-4 pb-4 pt-1 text-xs text-brand-mocha/80 leading-relaxed border-t border-brand-sand/40">
            {{ t('faq1A') }}
          </div>
        </div>

        <!-- FAQ 2 -->
        <div class="rounded-xl bg-brand-paper border border-brand-sand shadow-warm-sm overflow-hidden">
          <button 
            @click="toggleFaq(2)"
            class="w-full p-4 text-left font-bold text-xs sm:text-sm text-brand-espresso flex items-center justify-between gap-3 hover:bg-brand-cream/40 transition-colors"
          >
            <span class="flex items-center gap-2.5">
              <span class="w-5 h-5 rounded-md bg-brand-cream text-brand-chestnut flex items-center justify-center text-[11px] font-bold shrink-0 border border-brand-sand">2</span>
              {{ t('faq2Q') }}
            </span>
            <ChevronDown class="w-4 h-4 text-brand-latte transition-transform" :class="openFaq === 2 ? 'rotate-180 text-brand-chestnut' : ''" />
          </button>
          <div v-if="openFaq === 2" class="px-4 pb-4 pt-1 text-xs text-brand-mocha/80 leading-relaxed border-t border-brand-sand/40">
            {{ t('faq2A') }}
          </div>
        </div>

        <!-- FAQ 3 -->
        <div class="rounded-xl bg-brand-paper border border-brand-sand shadow-warm-sm overflow-hidden">
          <button 
            @click="toggleFaq(3)"
            class="w-full p-4 text-left font-bold text-xs sm:text-sm text-brand-espresso flex items-center justify-between gap-3 hover:bg-brand-cream/40 transition-colors"
          >
            <span class="flex items-center gap-2.5">
              <span class="w-5 h-5 rounded-md bg-brand-cream text-brand-chestnut flex items-center justify-center text-[11px] font-bold shrink-0 border border-brand-sand">3</span>
              {{ t('faq3Q') }}
            </span>
            <ChevronDown class="w-4 h-4 text-brand-latte transition-transform" :class="openFaq === 3 ? 'rotate-180 text-brand-chestnut' : ''" />
          </button>
          <div v-if="openFaq === 3" class="px-4 pb-4 pt-1 text-xs text-brand-mocha/80 leading-relaxed border-t border-brand-sand/40">
            {{ t('faq3A') }}
          </div>
        </div>

      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { HelpCircle, ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  currentLang: {
    type: String,
    default: 'th'
  },
  t: {
    type: Function,
    required: true
  }
})

const isTh = computed(() => props.currentLang === 'th')
const openFaq = ref(1)

function toggleFaq(id) {
  openFaq.value = openFaq.value === id ? null : id
}
</script>
