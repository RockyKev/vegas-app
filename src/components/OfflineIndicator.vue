<template>
  <Transition name="slide">
    <div v-if="isOffline" class="offline-indicator">
      <span class="offline-icon">📡</span>
      <span class="offline-text">You're offline</span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useOfflineDetection } from '../composables/useOfflineDetection'

const { isOffline } = useOfflineDetection()
</script>

<style scoped>
.offline-indicator {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ff4444;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.offline-icon {
  font-size: 1rem;
}

/* Slide animation */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translate(-50%, 100%);
  opacity: 0;
}
</style> 