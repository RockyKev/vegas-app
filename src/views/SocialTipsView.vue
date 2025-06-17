<template>
  <Container>
    <div class="social-tips">
      <div class="header-row">
        <h1>Social Tips</h1>
        <HelpToggle>
          <h3>Social Tips Help</h3>
          <p>Import your own tips by clicking the "Import Custom Tips" button and selecting a JSON file.</p>
          <p>Star important tips by clicking the star icon.</p>
          <p>Mark tips as completed by clicking the checkmark - completed tips are hidden by default.</p>
          <p>Filter tips by tags or show only favorites.</p>
          <p>Tips are loaded automatically as you scroll.</p>
          <p>If you don't import any tips, default tips will be shown.</p>
        </HelpToggle>
      </div>

      <div class="buttons-row">
        <!-- Import Section -->
        <div class="import-section">
          <input type="file" accept=".json" @change="handleFileImport" class="file-input" id="tip-import">
          <label for="tip-import" class="import-button">
            Import Custom Tips (JSON)
          </label>
          <span v-if="importError" class="error-message">{{ importError }}</span>
        </div>

        <!-- Download networking_tips.json -->
        <div class="download-section">
          <a href="/data/networking_tips.json" download="/data/networking_tips.json" class="download-button">
            Download template (JSON)
          </a>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="filter-controls">
        <div class="filter-row">
          <label class="filter-label">
            <input type="checkbox" v-model="showCompletedTips" class="filter-checkbox">
            Show completed tips
          </label>
          <label class="filter-label">
            <input type="checkbox" v-model="showOnlyFavorites" class="filter-checkbox">
            Show only favorites
          </label>
        </div>
        
        <!-- Tag Filter -->
        <div class="tag-filter">
          <label class="filter-label">Filter by tag:</label>
          <select v-model="selectedTag" class="tag-select">
            <option value="">All tags</option>
            <option v-for="tag in allTags" :key="tag" :value="tag">{{ tag }}</option>
          </select>
        </div>
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
            <p v-if="tip.source" class="tip-source">
              Source: <a :href="tip.source_link || tip.sourceLink" target="_blank">{{ tip.source }}</a>
            </p>
            
            <!-- Tags Display -->
            <div class="tip-tags" v-if="tip.tags && tip.tags.length > 0">
              <span class="tip-tag" v-for="tag in tip.tags" :key="tag">{{ tag }}</span>
            </div>
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

      <!-- No Results Message -->
      <div v-if="!isLoading && filteredTips.length === 0" class="no-results">
        No tips match your current filters.
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useAppStore } from '../stores/app'
import Container from '../components/Container.vue'
import HelpToggle from '../components/HelpToggle.vue'
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

// Process imported tips to ensure they have unique IDs and proper structure
const processImportedTips = (tips: NetworkingTip[]): NetworkingTip[] => {
  return tips.map(tip => ({
    ...tip,
    id: tip.id || tip.tipID || `custom_${Math.random().toString(36).substr(2, 9)}`,
    source_link: tip.source_link || tip.sourceLink
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
  importError,
  handleFileImport: baseHandleFileImport
} = useImportData<NetworkingTip>({
  validator: isNetworkingTipArray,
  onSuccess: handleImportedData,
  onError: handleError,
  allowedTypes: ['.json', 'application/json'],
  hasExistingData: () => allTips.value.length > 0
})

// Wrap the file import handler to use loading state
const handleFileImport = (event: Event) => {
  withLoading(Promise.resolve(baseHandleFileImport(event)))
}

// Filter state
const showCompletedTips = ref(false)
const showOnlyFavorites = ref(false)
const selectedTag = ref('')

// Pagination
const page = ref(1)
const tipsPerPage = 20
const tipsListRef = ref<HTMLElement | null>(null)

// Get all unique tags from tips
const allTags = computed(() => {
  const tags = new Set<string>()
  allTips.value.forEach(tip => {
    if (tip.tags) {
      tip.tags.forEach(tag => tags.add(tag))
    }
  })
  return Array.from(tags).sort()
})

// Filter tips based on current filters
const filteredTips = computed(() => {
  let tips = allTips.value

  // Filter by tag
  if (selectedTag.value) {
    tips = tips.filter(tip => tip.tags && tip.tags.includes(selectedTag.value))
  }

  // Filter by favorites
  if (showOnlyFavorites.value) {
    tips = tips.filter(tip => store.tipsStarred[tip.id])
  }

  // Filter by completed status - hide completed tips by default
  if (!showCompletedTips.value) {
    tips = tips.filter(tip => !store.tipsRead[tip.id])
  }

  return tips
})

// Compute visible tips based on current page and filters
const visibleTips = computed(() => {
  return filteredTips.value.slice(0, page.value * tipsPerPage)
})

// Reset pagination when filters change
watch([showCompletedTips, showOnlyFavorites, selectedTag], () => {
  page.value = 1
})

// Infinite scroll setup
const setupInfiniteScroll = () => {
  const observer = new IntersectionObserver((entries) => {
    const target = entries[0]
    if (target.isIntersecting && !isLoading.value && visibleTips.value.length < filteredTips.value.length) {
      loadMoreTips()
    }
  }, { threshold: 0.1 })

  // Set up observer after tips are rendered
  nextTick(() => {
    if (tipsListRef.value) {
      const tipItems = tipsListRef.value.querySelectorAll('.tip-item')
      if (tipItems.length > 0) {
        observer.observe(tipItems[tipItems.length - 1])
      }
    }
  })

  // Watch for changes in visible tips and re-observe
  watch(visibleTips, () => {
    nextTick(() => {
      if (tipsListRef.value) {
        const tipItems = tipsListRef.value.querySelectorAll('.tip-item')
        if (tipItems.length > 0) {
          observer.observe(tipItems[tipItems.length - 1])
        }
      }
    })
  })
}

// Load more tips
const loadMoreTips = () => {
  if (isLoading.value || visibleTips.value.length >= filteredTips.value.length) return
  
  isLoading.value = true
  setTimeout(() => {
    page.value++
    isLoading.value = false
  }, 300)
}

// Tip state management
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
  console.log('SocialTipsView mounted')
  try {
    console.log('Loading default data...')
    await withLoading(loadDefaultData())
    console.log('Default data loaded:', allTips.value)

    console.log('Initializing from store...')
    initializeFromStore()
    console.log('Store initialized, all data:', allTips.value)

    // Set up intersection observer for infinite scroll
    await nextTick()
    setupInfiniteScroll()
  } catch (err) {
    console.error('Error in onMounted:', err)
    handleError(err)
  }
})
</script>

<style scoped>
.social-tips {
  padding: 1rem 0;
}

.file-input {
  display: none;
}

.filter-controls {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  border: 1px solid #e9ecef;
}

.filter-row {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.filter-checkbox {
  margin: 0;
}

.tag-filter {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tag-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  background-color: white;
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

.tip-content-container {
  flex: 1;
}

.tip-content {
  margin: 0;
  color: var(--text-color);
  line-height: 1.6;
  flex: 1;
  text-align: left;
}

.tip-source {
  margin: 0;
  color: var(--text-color);
  font-size: 0.75rem;
  text-align: left;
}

.tip-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.tip-tag {
  padding: 0.125rem 0.5rem;
  background-color: #e3f2fd;
  border-radius: 0.75rem;
  font-size: 0.7rem;
  color: #1976d2;
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

.no-results {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
}

.error-message {
  color: #dc3545;
  padding: 1rem;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  
  .filter-row {
    flex-direction: row;
    align-items: center;
  }
  
  .tag-filter {
    flex-direction: row;
    align-items: center;
  }
}
</style>