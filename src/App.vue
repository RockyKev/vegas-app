<script setup lang="ts">
import { ref } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<template>
  <div class="app">
    <nav class="nav">
      <button class="menu-button" @click="toggleMenu">
        <span class="hamburger"></span>
      </button>
      <div class="menu" :class="{ 'menu-open': isMenuOpen }">
        <router-link to="/" @click="closeMenu">Home</router-link>
        <router-link to="/networking-tips" @click="closeMenu">Networking Tips</router-link>
        <router-link to="/calendar" @click="closeMenu">Calendar</router-link>
        <router-link to="/travel-info" @click="closeMenu">Travel Info</router-link>
        <router-link to="/contacts" @click="closeMenu">Contacts</router-link>
        <router-link to="/networking-targets" @click="closeMenu">Networking Targets</router-link>
      </div>
    </nav>
    <main class="main">
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1000;
}

.menu-button {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
}

.hamburger {
  display: block;
  width: 24px;
  height: 2px;
  background: #333;
  position: relative;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background: #333;
  left: 0;
}

.hamburger::before {
  top: -6px;
}

.hamburger::after {
  bottom: -6px;
}

.menu {
  position: fixed;
  top: 0;
  left: -250px;
  width: 250px;
  height: 100vh;
  background: #fff;
  padding: 4rem 1rem 1rem;
  transition: left 0.3s ease;
  box-shadow: 2px 0 4px rgba(0,0,0,0.1);
}

.menu-open {
  left: 0;
}

.menu a {
  display: block;
  padding: 0.5rem 0;
  color: #333;
  text-decoration: none;
  font-size: 1.1rem;
}

.menu a:hover {
  color: #666;
}

.main {
  margin-top: 4rem;
  flex: 1;
  padding: 1rem;
}
</style>
