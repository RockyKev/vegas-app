<template>
  <div class="state-manager">
    <h2>State Management</h2>
    
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAppStore } from '../stores/app'

const store = useAppStore()
const fileInput = ref<HTMLInputElement | null>(null)
const error = ref<string>('')

const exportState = () => {
  try {
    const state = store.exportState()
    const blob = new Blob([state], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'vegas-app-state.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (e) {
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
    }
  } catch (e) {
    error.value = 'Failed to import state'
  }
  
  // Reset the file input
  input.value = ''
}
</script>

<style scoped>
.state-manager {
  padding: 1rem;
  background: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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