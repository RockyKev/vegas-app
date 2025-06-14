<script setup lang="ts">
import ErrorBoundary from './components/ErrorBoundary.vue'
import OfflineIndicator from './components/OfflineIndicator.vue'
import InstallPrompt from './components/InstallPrompt.vue'
import BottomMenu from './components/BottomMenu.vue'

</script>

<template>
  <ErrorBoundary>
    <div class="app">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
      <OfflineIndicator />
      <InstallPrompt />
      <BottomMenu />
    </div>
  </ErrorBoundary>
</template>

<style>
:root {
  --primary-color: #4a90e2;
  --primary-color-rgb: 74, 144, 226;
  --primary-color-dark: #357abd;
  --text-color: #2c3e50;
  --background-color: #f5f7fa;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-color);
  background-color: var(--background-color);
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}

button {
  font-family: inherit;
}

a {
  color: var(--primary-color);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
} 

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--background-color);
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.nav {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  text-decoration: none;
}

.nav-links {
  display: none;
}

.nav-links a {
  color: var(--text-color);
  text-decoration: none;
  margin-left: 1.5rem;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: var(--primary-color);
}

.main {
  flex: 1;
}

/* Tablet and up */
@media (min-width: 768px) {
  .nav-content {
    padding: 1rem 2rem;
  }

  .nav-links {
    display: flex;
    align-items: center;
  }
}

.build-info {
  text-align: center;
  padding: 0.5rem;
  font-size: 0.75rem;
  color: #666;
  background: #f8f9fa;
  border-top: 1px solid #eee;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
