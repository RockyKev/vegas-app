<template>
  <div v-if="error" class="error-boundary">
    <h2>Something went wrong</h2>
    <p>{{ error.message }}</p>
    <button @click="handleReset">Try Again</button>
  </div>
  <slot v-else></slot>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { useAppStore } from '../stores/app'

const store = useAppStore()
const error = ref<Error | null>(null)

onErrorCaptured((err) => {
  error.value = err
  store.logError(err)
  return false // prevent error from propagating
})

const handleReset = () => {
  error.value = null
}
</script>

<style scoped>
.error-boundary {
  padding: 1rem;
  margin: 1rem;
  border: 1px solid #ff4444;
  border-radius: 0.5rem;
  background-color: #fff5f5;
  color: #cc0000;
}

button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #cc0000;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

button:hover {
  background-color: #990000;
}
</style> 