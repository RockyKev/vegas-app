<template>
  <Container>
    <div class="networking-tips">
      <h1>Networking Tips</h1>
      <div class="tips-list">
        <div v-for="tip in tips" :key="tip.id" class="tip-item">
          <div class="tip-content-container">
            <p class="tip-content">{{ tip.content }}</p>
            <p v-if="tip.source" class="tip-source">Source: <a :href="tip.source_link" target="_blank">{{ tip.source
                }}</a></p>

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
  source?: string
  source_link?: string
}

const store = useAppStore()
const tips = ref<NetworkingTip[]>([])

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
  try {
    const response = await fetch('/data/networking_tips.json')
    tips.value = await response.json()
  } catch (error) {
    console.error('Failed to load networking tips:', error)
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

/* Tablet and up */
@media (min-width: 768px) {
  h1 {
    font-size: 2rem;
  }
}
</style>