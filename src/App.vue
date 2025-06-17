<script setup lang="ts">
import ErrorBoundary from './components/ErrorBoundary.vue'
import OfflineIndicator from './components/OfflineIndicator.vue'
import InstallPrompt from './components/InstallPrompt.vue'
import BottomMenu from './components/BottomMenu.vue'

</script>

<template>
  <ErrorBoundary>
    <div>
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
/* ========================
   Root Variables & Global Styles
======================== */
:root {
  /* App Design Tokens */
  --primary-color: #4a90e2;
  --primary-color-rgb: 74, 144, 226;
  --primary-color-dark: #357abd;
  --text-color: #2c3e50;
  --background-color: #f5f7fa;

  /* Typography & Base Theme Defaults */
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Light Theme Overrides */
@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }

  a:hover {
    color: #747bff;
  }

  button {
    background-color: #f9f9f9;
  }
}

/* ========================
   Reset & Base Elements
======================== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;

  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: var(--text-color);
  background-color: var(--background-color);
  line-height: 1.6;
}

/* ========================
   Links
======================== */
a {
  font-weight: 500;
  color: var(--primary-color);
  text-decoration: none;
}

a:hover {
  color: #535bf2;
  text-decoration: underline;
}

/* ========================
   Buttons
======================== */
button {
  font-family: inherit;
  font-size: 1em;
  font-weight: 500;
  padding: 0.6em 1.2em;
  border-radius: 8px;
  border: 1px solid transparent;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #646cff;
}

button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

.import-section,
.download-section {
  margin: 1rem 0rem;
}

.import-button,
.download-button {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.import-button:hover,
.download-button:hover {
  color: white;
  text-decoration: none;
  background-color: var(--primary-color-dark);
}



/* ========================
   Layout & Components
======================== */
#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  min-height: 100vh;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1;
}

.header-row,
.buttons-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

p {
  margin: 0;
  color: var(--text-color);
  opacity: 0.8;
}
/* ========================
   Navigation
======================== */
.nav {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

/* ========================
   Animations & Effects
======================== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ========================
   Utility & Misc
======================== */
.card {
  padding: 2em;
}

.build-info {
  text-align: center;
  padding: 0.5rem;
  font-size: 0.75rem;
  color: #666;
  background: #f8f9fa;
  border-top: 1px solid #eee;
}

h1 {
  font-size: 1.75rem;
  line-height: 1.1;
  color: var(--text-color);
}

h2 {
  margin: 0 0 1rem;
  font-size: 1.25rem;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.5rem;
  color: var(--primary-color);
}


h3 {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  color: var(--text-color);
}

/* Tablet and up */
@media (min-width: 768px) {
  h1 {
    font-size: 2.75rem;
  }
}

.loading-message,
.error-message {
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  text-align: center;
}


.loading-message {
  background-color: #f8f9fa;
  color: #666;
}


.error-message {
  background-color: #fee;
  color: #c00;
}
</style>
