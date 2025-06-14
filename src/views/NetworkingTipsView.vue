<template>
  <Container>
    <div class="networking-tips">
      <h1>Networking Tips</h1>
      
      <!-- Import Section -->
      <div class="import-section">
        <input 
          type="file" 
          accept=".json" 
          @change="handleFileImport" 
          class="file-input"
          id="tip-import"
        >
        <label for="tip-import" class="import-button">
          Import Custom Tips
        </label>
      </div>

      <!-- Tips List -->
      <div class="tips-list" ref="tipsListRef">
        <div v-for="tip in visibleTips" :key="tip.id" class="tip-item">
          <div class="tip-content-container">
            <p class="tip-content">{{ tip.content }}</p>
            <p v-if="tip.source" class="tip-source">Source: <a :href="tip.source_link" target="_blank">{{ tip.source }}</a></p>
          </div>

          <div class="tip-actions">
            <button class="action-button" @click="toggleTipStar(tip.id)"
              :aria-label="isTipStarred(tip.id) ? 'Unstar tip' : 'Star tip'">
              {{ isTipStarred(tip.id) ? '⭐' : '☆' }}
            </button>
            <button v-if="!isTipRead(tip.id)" class="action-button" @click="markTipAsRead(tip.id)">
              ✓
            </button>
          </div>
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="isLoading" class="loading-indicator">
        Loading more tips...
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useAppStore } from '../stores/app'
import Container from '../components/Container.vue'
import type { NetworkingTip } from '../types/types'

const store = useAppStore()
const defaultTips = ref<NetworkingTip[]>([])
const customTips = ref<NetworkingTip[]>([])
const isLoading = ref(false)
const page = ref(1)
const tipsPerPage = 10
const tipsListRef = ref<HTMLElement | null>(null)

// Load custom tips from localStorage on mount
onMounted(async () => {
  try {
    // Load default tips
    const response = await fetch('/data/networking_tips.json')
    defaultTips.value = await response.json()

    // Load custom tips from app state
    const savedState = localStorage.getItem('vegas-app-state')
    if (savedState) {
      const state = JSON.parse(savedState)
      if (state.customData?.networkingTips) {
        customTips.value = state.customData.networkingTips
      }
    }

    // Set up intersection observer for infinite scroll
    setupInfiniteScroll()
  } catch (error) {
    console.error('Failed to load networking tips:', error)
  }
})

// Combine default and custom tips
const allTips = computed(() => [...defaultTips.value, ...customTips.value])

// Compute visible tips based on current page
const visibleTips = computed(() => {
  return allTips.value.slice(0, page.value * tipsPerPage)
})

// Handle file import
const handleFileImport = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const importedTips = JSON.parse(e.target?.result as string)
      if (Array.isArray(importedTips)) {
        // Add custom prefix to IDs to avoid conflicts
        const processedTips = importedTips.map(tip => ({
          ...tip,
          id: `custom_${tip.id}`
        }))
        customTips.value = processedTips
        
        // Save to app state
        const savedState = localStorage.getItem('vegas-app-state')
        const state = savedState ? JSON.parse(savedState) : {}
        state.customData = {
          ...state.customData,
          networkingTips: processedTips
        }
        localStorage.setItem('vegas-app-state', JSON.stringify(state))
      }
    } catch (error) {
      console.error('Failed to parse imported tips:', error)
    }
  }
  reader.readAsText(file)
}

// Infinite scroll setup
const setupInfiniteScroll = () => {
  const observer = new IntersectionObserver((entries) => {
    const target = entries[0]
    if (target.isIntersecting && !isLoading.value && visibleTips.value.length < allTips.value.length) {
      loadMoreTips()
    }
  }, { threshold: 0.5 })

  watch(tipsListRef, (newRef) => {
    if (newRef) {
      observer.observe(newRef)
    }
  })
}

// Load more tips
const loadMoreTips = () => {
  isLoading.value = true
  setTimeout(() => {
    page.value++
    isLoading.value = false
  }, 500)
}

const isTipRead = (tipId: string) => {
  return store.tipsRead[tipId] || false
}

const isTipStarred = (tipId: string) => {
  return store.tipsStarred[tipId] || false
}

const markTipAsRead = (tipId: string) => {
  store.markTipAsRead(tipId)
}

const toggleTipStar = (tipId: string) => {
  store.toggleTipStar(tipId)
}
</script>

<style scoped>
.networking-tips {
  padding: 1rem 0;
}

h1 {
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  color: var(--text-color);
}

.import-section {
  margin-bottom: 2rem;
}

.file-input {
  display: none;
}

.import-button {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.import-button:hover {
  background-color: var(--primary-color-dark);
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tip-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.tip-content {
  margin: 0;
  color: var(--text-color);
  line-height: 1.6;
  flex: 1;
}

.tip-source {
  margin: 0;
  color: var(--text-color);
  font-size: 0.875rem;
}

.tip-actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  font-size: 1.25rem;
  color: #666;
  transition: color 0.2s;
}

.action-button:hover {
  color: var(--primary-color);
}

.loading-indicator {
  text-align: center;
  padding: 1rem;
  color: #666;
}

/* Tablet and up */
@media (min-width: 768px) {
  h1 {
    font-size: 2rem;
  }
}
</style>