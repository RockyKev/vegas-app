<template>
  <div class="help-toggle">
    <button 
      class="help-button" 
      @click="isOpen = !isOpen"
      :aria-expanded="isOpen"
      :aria-label="isOpen ? 'Hide help' : 'Show help'"
    >
      ?
    </button>
    
    <div v-if="isOpen" class="help-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<style scoped>
.help-toggle {
  position: relative;
  display: inline-block;
}

.help-button {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid var(--primary-color);
  background: transparent;
  color: var(--primary-color);
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin-left: 0.5rem;
  transition: all 0.2s ease;
}

.help-button:hover {
  background: var(--primary-color);
  color: white;
}

.help-content {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.5rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 250px;
  max-width: 350px;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-color);
}

/* Add a small arrow pointing up */
.help-content::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 12px;
  width: 12px;
  height: 12px;
  background: white;
  transform: rotate(45deg);
  box-shadow: -2px -2px 2px rgba(0, 0, 0, 0.05);
}
</style> 