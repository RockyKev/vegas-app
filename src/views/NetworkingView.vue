<template>
  <Container>
    <div class="networking">
      <div class="header-row">
        <h1>Networking</h1>
        <HelpToggle>
          <h3>Networking Help</h3>
          <p>Import your networking targets by clicking the "Import Networking Contacts" button and selecting a JSON
            file.</p>
          <p>Track your progress with each contact using the status buttons:</p>
          <ul>
            <li>Not Met: Initial state</li>
            <li>Connected: After meeting them</li>
            <li>Followed Up: After sending a follow-up</li>
          </ul>
          <p>Use the filters to show/hide targets by status or filter by department.</p>
          <p>If you don't import any targets, default targets will be shown.</p>
        </HelpToggle>
      </div>

      <div class="buttons-row">
        <!-- Import Section -->
        <div class="import-section">
          <input type="file" accept=".json" @change="handleFileImport" class="file-input" id="targets-import">
          <label for="targets-import" class="import-button">
            Import Networking Contacts (JSON)
          </label>
          <span v-if="importError" class="error-message">{{ importError }}</span>
        </div>

        <div class="download-section">
          <a href="/data/networking_opportunities.json" download="/data/networking_opportunities.json" class="download-button">
            Download Template (JSON)
          </a>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="filter-controls">
        <div class="filter-row">
          <label class="filter-label">
            <input type="checkbox" v-model="showNotMet" class="filter-checkbox">
            Show not met
          </label>
          <label class="filter-label">
            <input type="checkbox" v-model="showConnected" class="filter-checkbox">
            Show connected
          </label>
          <label class="filter-label">
            <input type="checkbox" v-model="showFollowedUp" class="filter-checkbox">
            Show followed up
          </label>
        </div>
        
        <!-- Department Filter -->
        <div class="department-filter">
          <label class="filter-label">Filter by department:</label>
          <select v-model="selectedDepartment" class="department-select">
            <option value="">All departments</option>
            <option v-for="dept in allDepartments" :key="dept" :value="dept">{{ dept }}</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-message">
        Loading networking Contacts...
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Targets List -->
      <div v-else class="targets-list">
        <div v-for="target in filteredTargets" :key="target.id" class="target-item">
          <div class="target-header">
            <h2>{{ target.name }}
              <span v-if="target.title" class="target-title"> | {{ target.title }}</span>
              <span v-if="target.department" class="target-department"> | {{ target.department }} Dept</span>
            </h2>
            <button class="status-button" @click="toggleTargetStatus(target)"
              :class="getStatusClass(getTargetStatus(target))">
              {{ getStatusLabel(getTargetStatus(target)) }}
            </button>
          </div>

          <div class="target-details">
            <div v-if="target.connections && target.connections.length" class="target-section basis-full">
              <p class="connections-title">Connections:
                <span v-for="(connection, index) in target.connections" :key="index" class="connection-item">
                  {{ connection }},
                </span>
              </p>
            </div>

            <div v-if="target.personal_details && target.personal_details.length" class="target-section basis-half">
              <h3>Personal Details:</h3>
              <ul>
                <li v-for="(detail, index) in target.personal_details" :key="index">
                  {{ detail }}
                </li>
              </ul>
            </div>

            <div v-if="target.work_details && target.work_details.length" class="target-section basis-half">
              <h3>Work Details:</h3>
              <ul>
                <li v-for="(detail, index) in target.work_details" :key="index">
                  {{ detail }}
                </li>
              </ul>
            </div>

            <div v-if="target.questions && target.questions.length" class="target-section basis-full">
              <h3>Questions:</h3>
              <ul>
                <li v-for="(question, index) in target.questions" :key="index">
                  {{ question }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- No Results Message -->
        <div v-if="filteredTargets.length === 0" class="no-results">
          No networking targets match your current filters.
        </div>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import Container from '../components/Container.vue'
import HelpToggle from '../components/HelpToggle.vue'
import type { NetworkingTarget } from '../types/types'
import { useImportData } from '../composables/useImportData'
import { useImportableData } from '../composables/useImportableData'
import { useErrorHandler } from '../composables/useErrorHandler'
import { useLoadingState } from '../composables/useLoadingState'
import { useTargetStatus } from '../composables/useTargetStatus'

const networkingTargets = ref<NetworkingTarget[]>([])

// Filter state
const showNotMet = ref(true)
const showConnected = ref(true)
const showFollowedUp = ref(true)
const selectedDepartment = ref('')

// Get all unique departments from targets
const allDepartments = computed(() => {
  const departments = new Set<string>()
  allData.value.forEach(target => {
    if (target.department) {
      departments.add(target.department)
    }
  })
  return Array.from(departments).sort()
})

// Filter targets based on current filters
const filteredTargets = computed(() => {
  let targets = allData.value

  // Filter by status
  const statusFilters: string[] = []
  if (showNotMet.value) statusFilters.push('not-met')
  if (showConnected.value) statusFilters.push('connected')
  if (showFollowedUp.value) statusFilters.push('followed-up')

  if (statusFilters.length > 0) {
    targets = targets.filter(target => {
      const status = getTargetStatus(target)
      return statusFilters.includes(status)
    })
  }

  // Filter by department
  if (selectedDepartment.value) {
    targets = targets.filter(target => target.department === selectedDepartment.value)
  }

  return targets
})

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
const { error, handleError } = useErrorHandler()
const { isLoading, withLoading } = useLoadingState()
const { getStatusLabel, getStatusClass, toggleTargetStatus, getTargetStatus } = useTargetStatus()

const {
  allData,
  loadDefaultData,
  handleImportedData,
  initializeFromStore
} = useImportableData<NetworkingTarget>({
  defaultDataPath: '/data/networking_opportunities.json',
  storeKey: 'networking',
  validator: isNetworkingTargetArray,
  processImportedData: processImportedTargets
})

const {
  importError,
  handleFileImport: baseHandleFileImport
} = useImportData<NetworkingTarget>({
  validator: isNetworkingTargetArray,
  onSuccess: handleImportedData,
  onError: handleError,
  allowedTypes: ['.json', 'application/json'],
  hasExistingData: () => networkingTargets.value.length > 0
})

// Wrap the file import handler to use loading state
const handleFileImport = (event: Event) => {
  withLoading(Promise.resolve(baseHandleFileImport(event)))
}

onMounted(async () => {
  console.log('NetworkingView mounted')
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
h2 {
  border: none;
  margin: 0;
}

h3 {
  text-align: left;
  border-bottom: 1px solid var(--primary-color);
}

.target-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid var(--primary-color);
}

.networking {
  padding: 1rem 0;
}

.file-input {
  display: none;
}

.connections-title {
  font-weight: bold;
  text-align: left;
}

.connection-item {
  font-weight: normal;
}

.loading-message {
  background-color: #f8f9fa;
  color: #666;
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
  flex-wrap: wrap;
  flex-direction: row;
}

.basis-half {
  flex-basis: 50%;
}

.basis-full {
  flex-basis: 100%;
}

.target-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.target-section ul {
  margin: 0;
  padding-left: 1.5rem;
  text-align: left;
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

.filter-controls {
  margin-bottom: 1rem;
}

.filter-row {
  display: flex;
  gap: 0.5rem;
}

.filter-label {
  display: flex;
  align-items: center;
}

.filter-checkbox {
  margin-right: 0.5rem;
}

.department-filter {
  margin-top: 0.5rem;
}

.department-select {
  margin-left: 0.5rem;
}

.no-results {
  text-align: center;
  color: #666;
  margin-top: 1rem;
}
</style>