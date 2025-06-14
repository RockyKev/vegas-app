<template>
  <Container>
    <div class="home">
      <div class="header-row">
        <h1>2025 Vegas App</h1>
        <HelpToggle>
          <h3>Welcome to Vegas App!</h3>
          <p>This app helps you manage your conference experience in Las Vegas.</p>
          <p>Use the checklist to track your preparation tasks.</p>
          <p>Import your own data or use the default data provided.</p>
          <p>Toggle between default and custom data modes in the System Info section.</p>
        </HelpToggle>
      </div>
      
      <DynamicChecklist class="checklist-section-wrapper" />

      <div class="nav-cards">
        <router-link to="/calendar" class="nav-card">
          <h2>Calendar</h2>
          <p>View and manage your conference schedule</p>
        </router-link>
        <router-link to="/social-tips" class="nav-card">
          <h2>Social Tips</h2>
          <p>Get advice on making the most of your networking opportunities</p>
        </router-link>
        <router-link to="/networking" class="nav-card">
          <h2>Networking</h2>
          <p>Track your networking goals and progress</p>
        </router-link>
        <router-link to="/travel-info" class="nav-card">
          <h2>Travel Info</h2>
          <p>Access important travel information and resources</p>
        </router-link>
        <router-link to="/contacts" class="nav-card">
          <h2>Contacts</h2>
          <p>Manage your conference contacts</p>
        </router-link>
        <StateManager class="nav-card" />
      </div>

    </div>
  </Container>
</template>

<script setup lang="ts">
import Container from '../components/Container.vue'
import StateManager from '../components/SystemInfo.vue'
import DynamicChecklist from '../components/DynamicChecklist.vue'
import HelpToggle from '../components/HelpToggle.vue'
import { useAppStore } from '../stores/app'
import { onMounted } from 'vue'

const store = useAppStore()

onMounted(() => {
  store.loadFromLocalStorage()
})
</script>

<style scoped>
.home {
  padding: 1rem 0;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
}

h1 {
  margin: 0;
  font-size: 2rem;
  color: var(--text-color);
  text-align: center;
}

.checklist-section-wrapper {
  margin-bottom: 2rem;
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