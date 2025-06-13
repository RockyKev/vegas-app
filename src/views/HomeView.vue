<template>
  <div class="home">
    <h1>Vegas Trip Dashboard</h1>
    <div class="dashboard">
      <!-- Content will be dynamically rendered based on date -->
      <div class="checklist">
        <h2>Pre-trip Checklist</h2>
        <!-- Checklist items will go here -->
      </div>
      <div class="daily-tip">
        <h2>Daily Networking Tip</h2>
        <!-- Daily tip will go here -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from '../stores/app'

const store = useAppStore()

onMounted(() => {
  store.loadFromLocalStorage()
})
</script>

<style scoped>
.home {
  padding: 1rem;
}

.dashboard {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.checklist, .daily-tip {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 0.5rem;
}

h1 {
  margin-bottom: 1rem;
}

h2 {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}
</style> 