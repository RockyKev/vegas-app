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
        <span v-if="importError" class="error-message">{{ importError }}</span>
      </div>

      <!-- Error State -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Tips List -->
      <div v-else class="tips-list" ref="tipsListRef">
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
import { useImportData } from '../composables/useImportData'
import { useImportableData } from '../composables/useImportableData'
import { useErrorHandler } from '../composables/useErrorHandler'
import { useLoadingState } from '../composables/useLoadingState'

// Type guard for NetworkingTip array
const isNetworkingTipArray = (data: unknown): data is NetworkingTip[] => {
  return Array.isArray(data) && data.every(item => 
    typeof item === 'object' && 
    item !== null && 
    'content' in item
  )
}

// Process imported tips to ensure they have unique IDs
const processImportedTips = (tips: NetworkingTip[]): NetworkingTip[] => {
  return tips.map(tip => ({
    ...tip,
    id: tip.id || `custom_${Math.random().toString(36).substr(2, 9)}`
  }))
}

// Initialize composables
const store = useAppStore()
const { error, handleError } = useErrorHandler()
const { isLoading, withLoading } = useLoadingState()

const {
  allData: allTips,
  loadDefaultData,
  handleImportedData,
  initializeFromStore
} = useImportableData<NetworkingTip>({
  defaultDataPath: '/data/networking_tips.json',
  storeKey: 'networkingTips',
  validator: isNetworkingTipArray,
  processImportedData: processImportedTips
})

const {
  isImporting,
  importError,
  handleFileImport: baseHandleFileImport
} = useImportData<NetworkingTip>({
  validator: isNetworkingTipArray,
  onSuccess: handleImportedData,
  onError: handleError
})

// Wrap the file import handler to use loading state
const handleFileImport = (event: Event) => {
  withLoading(Promise.resolve(baseHandleFileImport(event)))
}

// Pagination
const page = ref(1)
const tipsPerPage = 10
const tipsListRef = ref<HTMLElement | null>(null)

// Compute visible tips based on current page
const visibleTips = computed(() => {
  return allTips.value.slice(0, page.value * tipsPerPage)
})

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

onMounted(async () => {
  console.log('NetworkingTipsView mounted')
  try {
    console.log('Loading default data...')
    await withLoading(loadDefaultData())
    console.log('Default data loaded:', allTips.value)
    
    console.log('Initializing from store...')
    initializeFromStore()
    console.log('Store initialized, all data:', allTips.value)

    // Set up intersection observer for infinite scroll
    setupInfiniteScroll()
  } catch (err) {
    console.error('Error in onMounted:', err)
    handleError(err)
  }
})
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

.error-message {
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  text-align: center;
  background-color: #fee;
  color: #c00;
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