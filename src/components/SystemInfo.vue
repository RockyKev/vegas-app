<template>
  <div>
    <h2>System Information</h2>
    
    <div class="actions">
      <button @click="exportState" class="action-button">
        Export State
      </button>
      
      <div class="import-section">
        <input
          type="file"
          accept=".json"
          @change="handleFileSelect"
          ref="fileInput"
          class="file-input"
        />
        <button @click="triggerFileInput" class="action-button">
          Import State
        </button>
      </div>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div class="info-section">
      <div class="info-item">
        <p class="value">Build: {{ buildTime }}</p>
        <p class="value">Storage:{{ storageUsage }}</p>
        <p class="value">Last Updated: {{ lastUpdated }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '../stores/app'

const store = useAppStore()
const fileInput = ref<HTMLInputElement | null>(null)
const error = ref<string>('')

// Get build time from environment variable
const buildTime = import.meta.env.VITE_BUILD_TIME 
  ? new Date(import.meta.env.VITE_BUILD_TIME).toLocaleString()
  : 'Build time not available'

// Storage usage calculation
const storageUsage = ref('')
const calculateStorageUsage = () => {
  try {
    let totalSize = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        const value = localStorage.getItem(key)
        if (value) {
          totalSize += value.length * 2 // Approximate size in bytes (2 bytes per character)
        }
      }
    }
    // Convert to KB and round to 1 decimal place
    const sizeInKB = (totalSize / 1024).toFixed(1)
    storageUsage.value = `${sizeInKB} KB`
  } catch (error) {
    console.error('Error calculating storage usage:', error)
    storageUsage.value = 'Error'
  }
}

// Last updated time
const lastUpdated = ref(new Date().toLocaleString())

// Calculate storage usage on mount and when data changes
onMounted(() => {
  calculateStorageUsage()
  // Add event listener for storage changes
  window.addEventListener('storage', calculateStorageUsage)
})

onUnmounted(() => {
  window.removeEventListener('storage', calculateStorageUsage)
})

const exportState = () => {
  try {
    console.log('Starting export...')
    const state = store.exportState()
    console.log('State from store:', state)
    const blob = new Blob([state], { type: 'application/json' })
    console.log('Blob created:', blob)
    const url = URL.createObjectURL(blob)
    console.log('URL created:', url)
    const a = document.createElement('a')
    a.href = url
    a.download = 'vegas-app-state.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    lastUpdated.value = new Date().toLocaleString()
  } catch (e) {
    console.error('Export error:', e)
    error.value = 'Failed to export state'
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  try {
    const text = await file.text()
    const success = store.importState(text)
    if (!success) {
      error.value = 'Invalid state file format'
    } else {
      error.value = ''
      lastUpdated.value = new Date().toLocaleString()
    }
  } catch (e) {
    error.value = 'Failed to import state'
  }
  
  // Reset the file input
  input.value = ''
}
</script>

<style scoped>
.system-info-card {
  padding: 1rem;
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 1rem;
}

h2 {
  margin: 0 0 1rem;
  font-size: 1.25rem;
  color: var(--text-color);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.import-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-input {
  display: none;
}

.action-button {
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: opacity 0.2s;
}

.action-button:hover {
  opacity: 0.9;
}

.error-message {
  margin-top: 1rem;
  padding: 0.5rem;
  background: #fee;
  color: #c00;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.info-section {
  border-top: 1px solid #eee;
  padding-top: 1rem;
  margin-top: 1rem;
}

.info-item {
  /* display: flex;
  justify-content: space-between; */
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  color: #666;
}


.label {
  font-weight: 500;
}

/* Tablet and up */
@media (min-width: 768px) {
  .actions {
    flex-direction: row;
    align-items: center;
  }

  .import-section {
    flex-direction: row;
    align-items: center;
  }
}
</style> 