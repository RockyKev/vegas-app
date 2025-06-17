<template>
  <Container>
    <div class="travel-info">
      <div class="header-row">
        <h1>Travel Information</h1>
        <HelpToggle>
          <h3>Travel Info Help</h3>
          <p>This section provides important information about:</p>
          <ul>
            <li>Venue locations and maps</li>
            <li>Transportation options</li>
            <li>Local amenities</li>
            <li>Emergency contacts</li>
          </ul>
          <p>Hover over sections to see more details.</p>
        </HelpToggle>
      </div>
      
      <div class="info-grid">
        <div v-for="info in travelInfo" :key="info.title" class="info-section">
          <h2>{{ info.title }}</h2>
          <img 
            v-if="info.image" 
            :src="info.image" 
            :alt="info.title"
            class="map-image"
          />
          <div v-if="info.content" class="content">
            <ul>
              <li v-for="(line, index) in info.content" :key="index">{{ line }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Container from '../components/Container.vue'
import HelpToggle from '../components/HelpToggle.vue'
import type { TravelInfo } from '../types/types'

const travelInfo = ref<TravelInfo[]>([])

onMounted(async () => {
  try {
    const response = await fetch('/data/travel_info.json')
    travelInfo.value = await response.json()
  } catch (error) {
    console.error('Failed to load travel info:', error)
  }
})
</script>

<style scoped>
.travel-info {
  padding: 1rem 0;
}


.info-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-section {
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.info-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.map-image {
  width: 100%;
  height: auto;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
}

.content {
  color: var(--text-color);
}

.content li {
  margin: 0 0 0.5rem 2rem;
}

.content li:last-child {
  margin-bottom: 0;
}

/* Tablet and up */
@media (min-width: 768px) {
  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  .info-section:has(.map-image) {
    grid-column: span 2;
  }
}
</style> 