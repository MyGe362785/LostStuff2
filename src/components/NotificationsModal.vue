<template>
  <div class="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
    <div class="fixed inset-0 bg-brand-espresso/60 backdrop-blur-sm" @click="$emit('close')"></div>

    <div
      class="relative w-full max-w-lg rounded-2xl bg-brand-paper shadow-warm-xl border border-brand-sand overflow-hidden z-10 my-6 flex flex-col max-h-[85vh]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notifications-title"
    >
      <div class="px-5 py-3.5 bg-brand-cream/90 border-b border-brand-sand flex items-center justify-between shrink-0">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-brand-chestnut flex items-center justify-center text-white">
            <Bell class="w-4 h-4" />
          </div>
          <div>
            <h3 id="notifications-title" class="font-bold text-sm sm:text-base text-brand-espresso">
              {{ t('notifTitle') }}
            </h3>
            <p class="text-[11px] text-brand-mocha/70">{{ t('notifSubtitle') }}</p>
          </div>
        </div>
        <button
          type="button"
          @click="$emit('close')"
          class="w-7 h-7 rounded-lg bg-brand-sand/60 hover:bg-brand-sand text-brand-mocha flex items-center justify-center transition-colors cursor-pointer"
          :aria-label="isTh ? 'ปิด' : 'Close'"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>

      <div class="overflow-y-auto flex-1">
        <div v-if="notifications.length === 0" class="px-6 py-12 text-center space-y-1.5">
          <p class="text-sm font-bold text-brand-espresso">{{ t('notifEmpty') }}</p>
          <p class="text-xs text-brand-latte leading-relaxed">{{ t('notifEmptyHint') }}</p>
        </div>

        <ul v-else class="divide-y divide-brand-sand/60">
          <li v-for="notification in notifications" :key="notification.id">
            <button
              type="button"
              @click="$emit('open-notification', notification)"
              class="w-full text-left px-5 py-3.5 flex gap-3 hover:bg-brand-cream/60 focus-visible:bg-brand-cream/60 focus-visible:outline-none transition-colors cursor-pointer"
              :class="unreadOnOpen.has(notification.id) ? 'bg-match-light/30' : ''"
            >
              <span
                class="mt-1.5 w-2 h-2 rounded-full shrink-0"
                :class="unreadOnOpen.has(notification.id) ? 'bg-match' : 'bg-transparent'"
                aria-hidden="true"
              ></span>
              <span class="flex-1 min-w-0 space-y-1">
                <span class="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span class="text-xs font-bold text-brand-espresso">{{ titleFor(notification) }}</span>
                  <span
                    v-if="unreadOnOpen.has(notification.id)"
                    class="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-match-light text-match-dark border border-match-border"
                  >
                    {{ t('notifNewBadge') }}
                  </span>
                </span>
                <span class="block text-xs text-brand-mocha leading-relaxed break-words">{{ notification.body }}</span>
                <span class="block text-[11px] text-brand-latte tabular-nums">{{ formatDateTime(notification.createdAt, isTh) }}</span>
              </span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { Bell, X } from 'lucide-vue-next'
import { formatDateTime } from '../utils/claimStatus'
import { NOTIFICATION_TITLE_KEYS } from '../utils/notifications'

const props = defineProps({
  notifications: { type: Array, default: () => [] },
  currentLang: { type: String, default: 'th' },
  t: { type: Function, required: true },
})

const emit = defineEmits(['close', 'open-notification', 'mark-all-read'])

const isTh = computed(() => props.currentLang === 'th')

// The panel marks everything read, so keep the badge on what was new. The list
// can still be loading when the panel opens, so watch instead of reading once.
const unreadOnOpen = ref(new Set())

watch(() => props.notifications, (list) => {
  const unread = list.filter(notification => !notification.readAt).map(notification => notification.id)
  if (unread.length === 0) return
  unreadOnOpen.value = new Set([...unreadOnOpen.value, ...unread])
  emit('mark-all-read')
}, { immediate: true })

function titleFor(notification) {
  return Object.hasOwn(NOTIFICATION_TITLE_KEYS, notification.kind)
    ? props.t(NOTIFICATION_TITLE_KEYS[notification.kind])
    : notification.title
}
</script>
