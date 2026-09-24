<template>
  <section
    v-if="items.length"
    class="rounded-xl border border-brand-sand/80 bg-brand-cream/45 px-3.5 py-3 sm:px-4"
    :aria-label="t('searchHistoryTitle')"
  >
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex items-center gap-2 text-xs font-bold text-brand-espresso">
        <History class="h-4 w-4 text-brand-caramel" aria-hidden="true" />
        <span>{{ t('searchHistoryTitle') }}</span>
      </div>
      <button
        type="button"
        class="rounded-md px-2 py-1 text-[11px] font-bold text-brand-chestnut transition-colors hover:bg-brand-sand/70 hover:text-brand-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-caramel"
        @click="$emit('clear')"
      >
        {{ t('clearSearchHistory') }}
      </button>
    </div>

    <div class="mt-2.5 flex max-w-full gap-2 overflow-x-auto pb-1" role="list">
      <div
        v-for="term in items"
        :key="term"
        class="inline-flex max-w-[16rem] shrink-0 items-center overflow-hidden rounded-lg border border-brand-sand bg-brand-paper text-brand-mocha shadow-warm-sm"
        role="listitem"
      >
        <button
          type="button"
          class="min-w-0 truncate px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-brand-cream hover:text-brand-espresso focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-caramel"
          @click="$emit('select', term)"
        >
          {{ term }}
        </button>
        <button
          type="button"
          class="flex h-8 w-8 shrink-0 items-center justify-center border-l border-brand-sand text-brand-latte transition-colors hover:bg-brand-sand/70 hover:text-brand-chestnut focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-caramel"
          :aria-label="removeLabel(term)"
          @click="$emit('remove', term)"
        >
          <X class="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { History, X } from 'lucide-vue-next'

const props = defineProps({
  items: { type: Array, default: () => [] },
  t: { type: Function, required: true },
})

defineEmits(['select', 'remove', 'clear'])

function removeLabel(term) {
  return props.t('removeSearchHistory').replace('{term}', term)
}
</script>
