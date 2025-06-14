<template>
  <nav class="bottom-menu">
    <router-link to="/" class="menu-item" :class="{ active: isActive('/') }">
      <span class="icon">🏠</span>
      <span class="label">Home</span>
    </router-link>
    <router-link to="/calendar" class="menu-item" :class="{ active: isActive('/calendar') }">
      <span class="icon">📅</span>
      <span class="label">Calendar</span>
    </router-link>
    <router-link to="/social-tips" class="menu-item" :class="{ active: isActive('/social-tips') }">
      <span class="icon">💡</span>
      <span class="label">Tips</span>
    </router-link>
    <router-link to="/networking" class="menu-item" :class="{ active: isActive('/networking') }">
      <span class="icon">🤝</span>
      <span class="label">Network</span>
    </router-link>
    <router-link to="/contacts" class="menu-item" :class="{ active: isActive('/contacts') }">
      <span class="icon">👥</span>
      <span class="label">Contacts</span>
    </router-link>
	<router-link to="/travel-info" class="menu-item" :class="{ active: isActive('/travel-info') }">
      <span class="icon">🛩️</span>
      <span class="label">Travel</span>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const isActive = (path: string) => {
  return route.path === path
}
</script>

<style scoped>
.bottom-menu {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  justify-content: space-around;
  padding: 0.5rem 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #666;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  width: 100%;
}

.menu-item.active {
  color: var(--primary-color);
  background: rgba(var(--primary-color-rgb), 0.1);
}

.icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.label {
  font-size: 0.75rem;
  font-weight: 500;
}

/* Add padding to the bottom of the main content to account for the fixed menu */
:global(body) {
  padding-bottom: 4.5rem;
}
</style> 