<template>
  <Container>
    <div class="networking-targets">
      <h1>Networking Targets</h1>
      
      <div class="targets-list">
        <div v-for="target in targets" :key="target.id" class="target-item">
          <div class="target-info">
            <h2>{{ target.name }}</h2>
            <p v-if="target.title" class="target-title">{{ target.title }}</p>
            <p v-if="target.company" class="target-company">{{ target.company }}</p>
          </div>
          
          <div class="target-details">
            <div class="target-goals">
              <ul>
                <li v-for="(goal, index) in target.goals" :key="index">
                  {{ goal }}
                </li>
              </ul>
            </div>
            <p v-if="target.notes" class="target-notes">{{ target.notes }}</p>
          </div>

          <button 
            class="status-button"
            @click="toggleTargetStatus(target.id)"
            :class="getStatusClass(target.id)"
          >
            {{ getStatusLabel(target.id) }}
          </button>
        </div>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
const targets = ref<NetworkingTarget[]>([])

// Mock data for now - will be replaced with data/people_to_meet.json
const mockTargets: NetworkingTarget[] = [
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
]

const getStatusLabel = (targetId: string) => {
  const status = store.peopleStatus[targetId]
  switch (status) {
    case 'connected':
      return 'Connected'
    case 'followed-up':
      return 'Followed Up'
    default:
      return 'Not Met'
  }
}

const getStatusClass = (targetId: string) => {
  const status = store.peopleStatus[targetId]
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

onMounted(() => {
  store.loadFromLocalStorage()
  targets.value = mockTargets
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
  background: #f8f9fa;
  border-radius: 0.25rem;
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

.target-title,
.target-company {
  margin: 0;
  font-size: 0.875rem;
  color: #666;
}

.target-details {
  font-size: 0.875rem;
  color: var(--text-color);
}

.target-goals ul {
  margin: 0;
  padding-left: 1.5rem;
}

.target-goals li {
  margin-bottom: 0.25rem;
}

.target-goals li:last-child {
  margin-bottom: 0;
}

.target-notes {
  margin: 0.5rem 0 0;
  font-style: italic;
  color: #666;
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