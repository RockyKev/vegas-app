<template>
  <Container>
    <div class="travel-info">
      <h1>Travel Information</h1>
      
      <div class="info-grid">
        <div class="map-section card">
          <h2>Venue Map</h2>
          <div class="map-container">
            <img 
              src="https://maps.googleapis.com/maps/api/staticmap?center=36.1215,-115.1694&zoom=15&size=600x400&maptype=roadmap&markers=color:red%7C36.1215,-115.1694&key=YOUR_API_KEY" 
              alt="Venue Map"
              class="map-image"
            />
          </div>
          <p class="map-note">
            Note: Replace YOUR_API_KEY with an actual Google Maps API key for production use.
          </p>
        </div>

        <div class="notes-section card">
          <h2>Important Notes</h2>
          <div class="notes-list">
            <div class="note-item">
              <h3>Airport Information</h3>
              <p>Harry Reid International Airport (LAS) is located about 5 miles from the Strip.</p>
              <ul>
                <li>Terminal 1: Domestic flights</li>
                <li>Terminal 3: International flights</li>
              </ul>
            </div>

            <div class="note-item">
              <h3>Transportation</h3>
              <p>Options for getting around:</p>
              <ul>
                <li>Rideshare (Uber/Lyft)</li>
                <li>Monorail (runs along the Strip)</li>
                <li>Bus (Deuce and SDX routes)</li>
                <li>Taxi (available at hotels and airport)</li>
              </ul>
            </div>

            <div class="note-item">
              <h3>Weather</h3>
              <p>Las Vegas has a desert climate:</p>
              <ul>
                <li>Summer: Hot (90-110°F)</li>
                <li>Winter: Mild (50-70°F)</li>
                <li>Low humidity year-round</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import Container from '../components/Container.vue'
</script>

<style scoped>
.travel-info {
  padding: 1rem 0;
}

h1 {
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  color: var(--text-color);
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h2 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: var(--text-color);
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.5rem;
}

.map-container {
  width: 100%;
  height: 300px;
  background: #f8f9fa;
  border-radius: 0.25rem;
  overflow: hidden;
  margin-bottom: 1rem;
}

.map-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.map-note {
  font-size: 0.875rem;
  color: #666;
  font-style: italic;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.note-item {
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
}

.note-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

h3 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  color: var(--text-color);
}

p {
  margin: 0 0 0.5rem;
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

/* Tablet and up */
@media (min-width: 768px) {
  h1 {
    font-size: 2rem;
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .map-container {
    height: 400px;
  }
}
</style> 