<template>
  <Container>
    <div class="home">
      <h1>Vegas App</h1>
      <div class="nav-cards">
        <router-link to="/calendar" class="nav-card">
          <h2>Calendar</h2>
          <p>View and manage your conference schedule</p>
        </router-link>
        <router-link to="/networking-tips" class="nav-card">
          <h2>Networking Tips</h2>
          <p>Get advice on making the most of your networking opportunities</p>
        </router-link>
        <router-link to="/travel-info" class="nav-card">
          <h2>Travel Info</h2>
          <p>Access important travel information and resources</p>
        </router-link>
        <router-link to="/contacts" class="nav-card">
          <h2>Contacts</h2>
          <p>Manage your conference contacts</p>
        </router-link>
        <router-link to="/networking-targets" class="nav-card">
          <h2>Networking Targets</h2>
          <p>Track your networking goals and progress</p>
        </router-link>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import Container from '../components/Container.vue'
</script>

<style scoped>
.home {
  padding: 1rem 0;
}

h1 {
  margin-bottom: 2rem;
  font-size: 2rem;
  color: var(--text-color);
  text-align: center;
}

.nav-cards {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}

.nav-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
}

.nav-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

h2 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  color: var(--primary-color);
}

p {
  margin: 0;
  color: var(--text-color);
  opacity: 0.8;
}

/* Tablet and up */
@media (min-width: 768px) {
  .nav-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .nav-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style> 