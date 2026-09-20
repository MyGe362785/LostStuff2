import { computed, ref } from 'vue'
import { listMyNotifications, markNotificationsRead } from '../services/lostFoundRepository'

/**
 * The signed-in user's notifications.
 * @param {{ enabled: boolean, getUserId: () => string | null, onNewUnread: (count: number) => void }} options
 *   `onNewUnread` runs when a refresh finds more unread notifications than before.
 */
export function useNotifications({ enabled, getUserId, onNewUnread }) {
  const notifications = ref([])
  const unreadCount = computed(() => notifications.value.filter(notification => !notification.readAt).length)
  let inFlight = null

  async function load(userId) {
    const previousUnread = unreadCount.value
    const loaded = await listMyNotifications(userId)
    // The user may have signed out or switched accounts while this loaded.
    if (getUserId() !== userId) return
    notifications.value = loaded
    if (unreadCount.value > previousUnread) onNewUnread(unreadCount.value)
  }

  function refresh() {
    if (!enabled) return Promise.resolve()
    const userId = getUserId()
    if (!userId) {
      notifications.value = []
      return Promise.resolve()
    }
    // Page load, auth changes and tab focus can all ask at once; one request
    // answers them all, so the "new notifications" toast fires once.
    if (inFlight && inFlight.userId === userId) return inFlight.promise
    const promise = load(userId).finally(() => {
      if (inFlight && inFlight.promise === promise) inFlight = null
    })
    inFlight = { userId, promise }
    return promise
  }

  async function markAllRead() {
    const userId = getUserId()
    const unreadIds = notifications.value.filter(notification => !notification.readAt).map(notification => notification.id)
    if (unreadIds.length === 0) return
    await markNotificationsRead(unreadIds)
    // Another account may have signed in while the update ran.
    if (getUserId() !== userId) return
    const readAt = new Date().toISOString()
    notifications.value = notifications.value.map(notification => (notification.readAt ? notification : { ...notification, readAt }))
  }

  function clear() {
    notifications.value = []
  }

  return { notifications, unreadCount, refresh, markAllRead, clear }
}
