<template>
  <Container>
    <div class="networking-targets">
      <h1>Networking Targets</h1>
      
      <div class="targets-header">
        <button class="add-target-button" @click="showAddTarget = true">
          Add Target
        </button>
      </div>

      <div class="targets-list">
        <div v-for="target in targets" :key="target.id" class="target-card card">
          <div class="target-header">
            <h2>{{ target.name }}</h2>
            <div class="target-actions">
              <button 
                class="action-button"
                @click="toggleTargetStatus(target.id)"
                :aria-label="getStatusLabel(target.id)"
              >
                {{ getStatusIcon(target.id) }}
              </button>
            </div>
          </div>
          
          <div class="target-details">
            <p v-if="target.title" class="target-title">{{ target.title }}</p>
            <p v-if="target.company" class="target-company">{{ target.company }}</p>
            
            <div class="target-goals">
              <h3>Goals</h3>
              <ul>
                <li v-for="(goal, index) in target.goals" :key="index">
                  {{ goal }}
                </li>
              </ul>
            </div>

            <div class="target-notes">
              <h3>Notes</h3>
              <p>{{ target.notes }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Target Modal -->
      <div v-if="showAddTarget" class="modal">
        <div class="modal-content card">
          <h2>Add New Target</h2>
          <form @submit.prevent="addTarget" class="target-form">
            <div class="form-group">
              <label for="name">Name</label>
              <input 
                type="text" 
                id="name" 
                v-model="newTarget.name"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="title">Title</label>
              <input 
                type="text" 
                id="title" 
                v-model="newTarget.title"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="company">Company</label>
              <input 
                type="text" 
                id="company" 
                v-model="newTarget.company"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="goals">Goals (one per line)</label>
              <textarea 
                id="goals" 
                v-model="goalsText"
                class="form-input"
                rows="3"
                placeholder="Enter goals, one per line"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="notes">Notes</label>
              <textarea 
                id="notes" 
                v-model="newTarget.notes"
                class="form-input"
                rows="3"
              ></textarea>
            </div>

            <div class="form-actions">
              <button type="button" @click="showAddTarget = false" class="cancel-button">
                Cancel
              </button>
              <button type="submit" class="submit-button">
                Add Target
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '../stores/app'
import Container from '../components/Container.vue'

interface NetworkingTarget {
  id: string
  name: string
  title?: string
  company?: string
  goals: string[]
  notes?: string
}

const store = useAppStore()
const showAddTarget = ref(false)

const newTarget = ref<Partial<NetworkingTarget>>({
  name: '',
  title: '',
  company: '',
  goals: [],
  notes: ''
})

const goalsText = ref('')

// Mock data for now - will be replaced with actual data management
const targets = ref<NetworkingTarget[]>([
  {
    id: '1',
    name: 'Tech Industry Leaders',
    title: 'Senior Executives',
    company: 'Various Companies',
    goals: [
      'Learn about industry trends',
      'Discuss potential partnerships',
      'Share our company vision'
    ],
    notes: 'Focus on companies in the AI and cloud computing space.'
  },
  {
    id: '2',
    name: 'Startup Founders',
    title: 'Founders & CEOs',
    company: 'Early-stage Startups',
    goals: [
      'Explore investment opportunities',
      'Share our growth experience',
      'Build mentor relationships'
    ],
    notes: 'Particularly interested in fintech and healthcare startups.'
  }
])

const getStatusIcon = (targetId: string) => {
  const status = store.peopleStatus[targetId]
  switch (status) {
    case 'connected':
      return '✓'
    case 'followed-up':
      return '★'
    default:
      return '○'
  }
}

const getStatusLabel = (targetId: string) => {
  const status = store.peopleStatus[targetId]
  switch (status) {
    case 'connected':
      return 'Mark as not connected'
    case 'followed-up':
      return 'Mark as not followed up'
    default:
      return 'Mark as connected'
  }
}

const toggleTargetStatus = (targetId: string) => {
  const currentStatus = store.peopleStatus[targetId]
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
  
  store.updatePersonStatus(targetId, newStatus)
}

const addTarget = () => {
  const target: NetworkingTarget = {
    id: Date.now().toString(),
    name: newTarget.value.name || '',
    title: newTarget.value.title,
    company: newTarget.value.company,
    goals: goalsText.value.split('\n').filter(goal => goal.trim()),
    notes: newTarget.value.notes
  }
  
  targets.value.push(target)
  showAddTarget.value = false
  newTarget.value = {
    name: '',
    title: '',
    company: '',
    goals: [],
    notes: ''
  }
  goalsText.value = ''
}
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

.targets-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.add-target-button {
  background: var(--primary-color);
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  transition: opacity 0.2s;
}

.add-target-button:hover {
  opacity: 0.9;
}

.targets-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.target-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.target-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-color);
}

.target-actions {
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

.target-details {
  color: var(--text-color);
}

.target-title,
.target-company {
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

.target-goals,
.target-notes {
  margin-top: 1rem;
}

h3 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  color: var(--text-color);
}

ul {
  margin: 0;
  padding-left: 1.5rem;
  color: var(--text-color);
}

li {
  margin-bottom: 0.25rem;
}

li:last-child {
  margin-bottom: 0;
}

.target-notes p {
  margin: 0;
  font-size: 0.875rem;
  color: #666;
  font-style: italic;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  margin: 1rem;
}

.target-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-size: 0.875rem;
  color: var(--text-color);
  font-weight: 500;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  font-size: 1rem;
}

textarea.form-input {
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel-button {
  background: none;
  border: 1px solid #ddd;
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  color: var(--text-color);
  transition: all 0.2s;
}

.cancel-button:hover {
  background: #f8f9fa;
}

.submit-button {
  background: var(--primary-color);
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  transition: opacity 0.2s;
}

.submit-button:hover {
  opacity: 0.9;
}

/* Tablet and up */
@media (min-width: 768px) {
  h1 {
    font-size: 2rem;
  }

  .targets-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}
</style> 