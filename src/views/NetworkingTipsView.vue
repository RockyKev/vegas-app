<template>
  <Container>
    <div class="networking-tips">
      <h1>Networking Tips</h1>
      <div class="tips-list">
        <div v-for="tip in displayedTips" :key="tip.id" class="tip-card card">
          <div class="tip-header">
            <h2>{{ tip.title }}</h2>
            <div class="tip-actions">
              <button 
                class="action-button"
                @click="toggleTipStar(tip.id)"
                :aria-label="isTipStarred(tip.id) ? 'Unstar tip' : 'Star tip'"
              >
                {{ isTipStarred(tip.id) ? '★' : '☆' }}
              </button>
            </div>
          </div>
          <p class="tip-content">{{ tip.content }}</p>
          <div class="tip-footer">
            <span class="tip-category">{{ tip.category }}</span>
            <button 
              v-if="!isTipRead(tip.id)"
              class="mark-read-button"
              @click="markTipAsRead(tip.id)"
            >
              Mark as Read
            </button>
          </div>
        </div>
        <div v-if="hasMoreTips" class="load-more">
          <button 
            class="load-more-button"
            @click="loadMoreTips"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Loading...' : 'Load More Tips' }}
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

interface NetworkingTip {
  id: string
  title: string
  content: string
  category: string
}

const store = useAppStore()
const displayedTips = ref<NetworkingTip[]>([])
const page = ref(1)
const isLoading = ref(false)
const hasMoreTips = ref(true)

// Mock data for now - will be replaced with API call
const mockTips: NetworkingTip[] = [
  {
    id: '1',
    title: 'The Power of First Impressions',
    content: 'Make eye contact, smile, and offer a firm handshake. Your first impression sets the tone for the entire conversation.',
    category: 'First Meeting'
  },
  {
    id: '2',
    title: 'Active Listening',
    content: 'Focus on understanding rather than responding. Ask follow-up questions to show genuine interest.',
    category: 'Communication'
  },
  {
    id: '3',
    title: 'Follow Up Effectively',
    content: 'Send a personalized message within 24 hours of meeting someone. Reference specific points from your conversation.',
    category: 'Follow-up'
  },
  {
    id: '4',
    title: 'Elevator Pitch',
    content: 'Prepare a concise 30-second introduction that highlights your unique value proposition.',
    category: 'Self-Presentation'
  },
  {
    id: '5',
    title: 'Body Language',
    content: 'Maintain open posture, nod appropriately, and mirror the other person\'s body language to build rapport.',
    category: 'Non-verbal'
  }
]

const loadTips = async () => {
  isLoading.value = true
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const start = (page.value - 1) * 5
  const end = start + 5
  const newTips = mockTips.slice(start, end)
  
  if (newTips.length === 0) {
    hasMoreTips.value = false
  } else {
    displayedTips.value = [...displayedTips.value, ...newTips]
  }
  
  isLoading.value = false
}

const loadMoreTips = () => {
  page.value++
  loadTips()
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

onMounted(() => {
  store.loadFromLocalStorage()
  loadTips()
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

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tip-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.tip-header {
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

.tip-content {
  margin: 0 0 1rem;
  color: var(--text-color);
  line-height: 1.6;
}

.tip-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.tip-category {
  font-size: 0.875rem;
  color: #666;
  background: #f8f9fa;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
}

.mark-read-button {
  background: none;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.mark-read-button:hover {
  background: var(--primary-color);
  color: #fff;
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.load-more-button {
  background: var(--primary-color);
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  transition: opacity 0.2s;
}

.load-more-button:hover:not(:disabled) {
  opacity: 0.9;
}

.load-more-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Tablet and up */
@media (min-width: 768px) {
  h1 {
    font-size: 2rem;
  }

  .tips-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}
</style> 