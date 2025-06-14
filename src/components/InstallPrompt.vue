<template>
  <div v-if="showInstallPrompt || showMobilePrompt" class="install-prompt">
    <div class="install-prompt-content">
      <p>Install Vegas App for a better experience!</p>
      <div class="install-prompt-buttons">
        <button v-if="deferredPrompt" @click="installApp" class="install-button">Install</button>
        <button v-else @click="toggleMobileInstructions" class="install-button">How to Install</button>
        <button @click="dismissPrompt" class="dismiss-button">Not Now</button>
      </div>
      <div v-if="showMobileInstructions" class="mobile-instructions">
        <p>To install on your device:</p>
        <ol>
          <li>Open this website in Chrome</li>
          <li>Tap the menu (⋮) in the top right</li>
          <li>Select "Add to Home screen"</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const showInstallPrompt = ref(false)
const showMobilePrompt = ref(false)
const showMobileInstructions = ref(false)
let deferredPrompt: any = null

const installApp = async () => {
  if (!deferredPrompt) return

  // Show the install prompt
  deferredPrompt.prompt()

  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice

  // We no longer need the prompt. Clear it up
  deferredPrompt = null

  // Hide our custom prompt
  showInstallPrompt.value = false

  // Optionally, send analytics event with outcome
  console.log(`User response to the install prompt: ${outcome}`)
}

const dismissPrompt = () => {
  showInstallPrompt.value = false
  showMobilePrompt.value = false
  showMobileInstructions.value = false
  // Store in localStorage that user dismissed the prompt
  localStorage.setItem('installPromptDismissed', 'true')
}

const toggleMobileInstructions = () => {
  showMobileInstructions.value = !showMobileInstructions.value
}

onMounted(() => {
  // Check if we should show the prompt
  const wasDismissed = localStorage.getItem('installPromptDismissed')
  if (wasDismissed) return

  // Check if we're on a mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches

  // If we're on mobile and not in standalone mode, show the mobile prompt
  if (isMobile && !isStandalone) {
    showMobilePrompt.value = true
  }

  // Listen for the beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompt event fired')
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault()
    // Stash the event so it can be triggered later
    deferredPrompt = e
    // Show our custom prompt
    showInstallPrompt.value = true
  })

  // Listen for successful installation
  window.addEventListener('appinstalled', () => {
    console.log('App was installed')
    showInstallPrompt.value = false
    showMobilePrompt.value = false
  })
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', () => {})
  window.removeEventListener('appinstalled', () => {})
})
</script>

<style scoped>
.install-prompt {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 1rem;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.install-prompt-content {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.install-prompt-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.install-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.dismiss-button {
  background-color: #f0f0f0;
  color: #666;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.install-button:hover {
  background-color: var(--primary-color-dark);
}

.dismiss-button:hover {
  background-color: #e0e0e0;
}

.mobile-instructions {
  margin-top: 1rem;
  text-align: left;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.mobile-instructions ol {
  margin-top: 0.5rem;
  padding-left: 1.5rem;
}

.mobile-instructions li {
  margin-bottom: 0.5rem;
}
</style> 