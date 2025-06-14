import { ref, onMounted, onUnmounted } from 'vue'

export function useOfflineDetection() {
  const isOffline = ref(!navigator.onLine)

  const updateOnlineStatus = () => {
    isOffline.value = !navigator.onLine
  }

  onMounted(() => {
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
  })

  onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus)
    window.removeEventListener('offline', updateOnlineStatus)
  })

  return {
    isOffline
  }
} 