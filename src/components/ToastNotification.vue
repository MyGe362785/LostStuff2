<template>
  <div 
    class="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none"
    aria-live="polite"
    aria-atomic="true"
    role="status"
  >
    <TransitionGroup 
      enter-active-class="transform transition ease-out duration-300"
      enter-from-class="translate-y-4 opacity-0 scale-95"
      enter-to-class="translate-y-0 opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="pointer-events-auto p-4 rounded-2xl bg-brand-paper shadow-warm-xl border border-brand-sand flex items-start gap-3 relative overflow-hidden"
      >
        <!-- Accent Side Stripe -->
        <div 
          class="w-1 absolute left-0 top-0 bottom-0"
          :class="{
            'bg-found': toast.type === 'success',
            'bg-match': toast.type === 'match',
            'bg-lost': toast.type === 'warning',
            'bg-brand-caramel': toast.type === 'info' || !toast.type
          }"
        ></div>

        <!-- Icon -->
        <div 
          class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          :class="{
            'bg-found-light text-found-dark': toast.type === 'success',
            'bg-match-light text-match-dark': toast.type === 'match',
            'bg-lost-light text-lost-dark': toast.type === 'warning',
            'bg-brand-cream text-brand-chestnut': toast.type === 'info' || !toast.type
          }"
        >
          <CheckCircle2 v-if="toast.type === 'success'" class="w-5 h-5" />
          <Sparkles v-else-if="toast.type === 'match'" class="w-5 h-5" />
          <AlertCircle v-else-if="toast.type === 'warning'" class="w-5 h-5" />
          <Info v-else class="w-5 h-5" />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0 pr-2">
          <h4 class="font-bold text-xs sm:text-sm text-brand-espresso mb-0.5">
            {{ toast.title }}
          </h4>
          <p class="text-xs text-brand-mocha/80 leading-relaxed">
            {{ toast.message }}
          </p>
        </div>

        <!-- Close button -->
        <button 
          @click="$emit('dismiss', toast.id)"
          class="text-brand-latte hover:text-brand-espresso p-1 rounded-lg transition-colors shrink-0"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { CheckCircle2, Sparkles, AlertCircle, Info, X } from 'lucide-vue-next'

defineProps({
  toasts: {
    type: Array,
    default: () => []
  }
})

defineEmits(['dismiss'])
</script>
