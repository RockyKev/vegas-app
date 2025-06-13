<template>
  <Container>
    <div class="networking-tips">
      <h1>Networking Tips</h1>
      <div class="tips-list">
        <div v-for="tip in tips" :key="tip.id" class="tip-item">
          <p class="tip-content">{{ tip.content }}</p>
          <div class="tip-actions">
            <button 
              class="action-button"
              @click="toggleTipStar(tip.id)"
              :aria-label="isTipStarred(tip.id) ? 'Unstar tip' : 'Star tip'"
            >
              {{ isTipStarred(tip.id) ? '⭐' : '☆' }}
            </button>
            <button 
              v-if="!isTipRead(tip.id)"
              class="action-button"
              @click="markTipAsRead(tip.id)"
            >
              ✓
            </button>
          </div>
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
  content: string
}

const store = useAppStore()
const tips = ref<NetworkingTip[]>([])

// Mock data for now - will be replaced with data/networking_tips.json
const mockTips: NetworkingTip[] = [
  {
    id: '1',
    content: 'Make eye contact, smile, and offer a firm handshake. Your first impression sets the tone for the entire conversation.'
  },
  {
    id: '2',
    content: 'Focus on understanding rather than responding. Ask follow-up questions to show genuine interest.'
  },
  {
    id: '3',
    content: 'Send a personalized message within 24 hours of meeting someone. Reference specific points from your conversation.'
  }
]

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
  tips.value = mockTips
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

/* Tablet and up */
@media (min-width: 768px) {
  h1 {
    font-size: 2rem;
  }
}
</style> 