<template>
  <Container>
    <div class="networking-targets">
      <h1>Networking Targets</h1>

      <!-- Import Section -->
      <div class="import-section">
        <input 
          type="file" 
          accept=".json" 
          @change="handleFileImport" 
          class="file-input"
          id="targets-import"
        >
        <label for="targets-import" class="import-button">
          Import Targets (JSON)
        </label>
        <span v-if="importError" class="error-message">{{ importError }}</span>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-message">
        Loading networking targets...
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Targets List -->
      <div v-else class="targets-list">
        <div v-for="target in allData" :key="target.id" class="target-item">
          <div class="target-info">
            <h2>{{ target.name }}
              <span v-if="target.title" class="target-title"> | {{ target.title }}</span>
              <span v-if="target.department" class="target-department"> | {{ target.department }} Dept</span>
            </h2>
            <button class="status-button" @click="toggleTargetStatus(target.id)"
              :class="getStatusClass(target.status || 'not-met')">
              {{ getStatusLabel(target.status || 'not-met') }}
            </button>
          </div>

          <div class="target-details">
            <div v-if="target.connections && target.connections.length" class="target-section">
              <h3>Connections:
                <span v-for="(connection, index) in target.connections" :key="index">
                  {{ connection }},
                </span>
              </h3>
            </div>

            <div v-if="target.personal_details && target.personal_details.length" class="target-section">
              <h3>Personal Details:</h3>
              <ul>
                <li v-for="(detail, index) in target.personal_details" :key="index">
                  {{ detail }}
                </li>
              </ul>
            </div>

            <div v-if="target.work_details && target.work_details.length" class="target-section">
              <h3>Work Details:</h3>
              <ul>
                <li v-for="(detail, index) in target.work_details" :key="index">
                  {{ detail }}
                </li>
              </ul>
            </div>

            <div v-if="target.questions && target.questions.length" class="target-section">
              <h3>Questions:</h3>
              <ul>
                <li v-for="(question, index) in target.questions" :key="index">
                  {{ question }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Container from '../components/Container.vue'
import type { NetworkingTarget } from '../types/types'
import { useImportData } from '../composables/useImportData'
import { useImportableData } from '../composables/useImportableData'
import { useErrorHandler } from '../composables/useErrorHandler'
import { useLoadingState } from '../composables/useLoadingState'
import { useAppStore } from '../stores/app'

// Type guard for NetworkingTarget array
const isNetworkingTargetArray = (data: unknown): data is NetworkingTarget[] => {
  return Array.isArray(data) && data.every(item => 
    typeof item === 'object' && 
    item !== null && 
    'name' in item
  )
}

// Process imported targets to ensure they have unique IDs
const processImportedTargets = (targets: NetworkingTarget[]): NetworkingTarget[] => {
  return targets.map(target => ({
    ...target,
    id: target.id || `default_${Math.random().toString(36).substr(2, 9)}`
  }))
}

// Initialize composables
const store = useAppStore()
const { error, handleError } = useErrorHandler()
const { isLoading, withLoading } = useLoadingState()

const {
  allData,
  loadDefaultData,
  handleImportedData,
  initializeFromStore
} = useImportableData<NetworkingTarget>({
  defaultDataPath: '/data/networking_targets.json',
  storeKey: 'networking',
  validator: isNetworkingTargetArray,
  processImportedData: processImportedTargets
})

const {
  isImporting,
  importError,
  handleFileImport: baseHandleFileImport
} = useImportData<NetworkingTarget>({
  validator: isNetworkingTargetArray,
  onSuccess: handleImportedData,
  onError: handleError
})

// Wrap the file import handler to use loading state
const handleFileImport = (event: Event) => {
  withLoading(Promise.resolve(baseHandleFileImport(event)))
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'connected':
      return 'Connected'
    case 'followed-up':
      return 'Followed Up'
    default:
      return 'Not Met'
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'connected':
      return 'status-connected'
    case 'followed-up':
      return 'status-followed-up'
    default:
      return 'status-not-met'
  }
}

const toggleTargetStatus = (targetId: string) => {
  const target = allData.value.find(t => t.id === targetId)
  if (!target) return

  const currentStatus = target.status || 'not-met'
  let newStatus: 'not-met' | 'connected' | 'followed-up'

  switch (currentStatus) {
    case 'connected':
      newStatus = 'followed-up'
      break
    case 'followed-up':
      newStatus = 'not-met'
      break
    default:
      newStatus = 'connected'
  }

  target.status = newStatus
  store.updatePersonStatus(targetId, newStatus)
}

onMounted(async () => {
  console.log('NetworkingTargetsView mounted')
  try {
    console.log('Loading default data...')
    await withLoading(loadDefaultData())
    console.log('Default data loaded:', allData.value)
    
    console.log('Initializing from store...')
    initializeFromStore()
    console.log('Store initialized, all data:', allData.value)
  } catch (err) {
    console.error('Error in onMounted:', err)
    handleError(err)
  }
})
</script>

<style scoped>
.networking-targets {
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

.loading-message,
.error-message {
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  text-align: center;
}

.loading-message {
  background-color: #f8f9fa;
  color: #666;
}

.error-message {
  background-color: #fee;
  color: #c00;
}

.targets-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.target-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: #ffffff;
  border-radius: 0.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.target-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

h2 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-color);
}

h3 {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.target-title,
.target-department {
  margin: 0;
  font-size: 0.875rem;
  color: #666;
}

.target-details {
  font-size: 0.875rem;
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.target-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.target-section ul {
  margin: 0;
  padding-left: 1.5rem;
}

.target-section li {
  margin-bottom: 0.25rem;
}

.target-section li:last-child {
  margin-bottom: 0;
}

.status-button {
  align-self: flex-start;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.status-button:hover {
  opacity: 0.9;
}

.status-not-met {
  background: #e9ecef;
  color: #495057;
}

.status-connected {
  background: #28a745;
  color: white;
}

.status-followed-up {
  background: #17a2b8;
  color: white;
}

/* Tablet and up */
@media (min-width: 768px) {
  h1 {
    font-size: 2rem;
  }
}
</style>