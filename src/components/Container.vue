<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
// No props or logic needed for now
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    max-width: 720px;
    width: 100vw;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    max-width: 960px;
  }
}

/* Large desktop and up */
@media (min-width: 1280px) {
  .container {
    max-width: 1140px;
  }
}

/* Extra large desktop and up */
@media (min-width: 1536px) {
  .container {
    max-width: 1320px;
  }
}

</style> 