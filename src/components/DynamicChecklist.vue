<template>
  <div class="dynamic-checklist">
    <div v-if="loading" class="loading">
      Loading checklist...
    </div>
    <div v-else-if="visibleSections.length === 0" class="no-sections">
      No sections available for today ({{ currentDate }}).
    </div>
    <div v-else v-for="section in visibleSections" :key="section.title" class="checklist-section">
      <h2>{{ section.title }}</h2>
      <ul class="checklist">
        <li v-for="item in section.checklist" :key="item" class="checklist-item">
          <label class="checkbox-label">
            <input
              type="checkbox"
              :checked="isItemCompleted(section.title, item)"
              @change="toggleItem(section.title, item)"
            >
            <span :class="{ completed: isItemCompleted(section.title, item) }">
              {{ item }}
            </span>
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface TodoSection {
  type: 'recurring' | 'one-time'
  date_before: string | null
  date_on: string | null
  date_after: string | null
  title: string
  checklist: string[]
}

const loading = ref(true)
const todoData = ref<TodoSection[]>([])
const completedItems = ref<Record<string, boolean>>({})
const currentDate = ref(new Date().toISOString().split('T')[0])

// Load completed items from localStorage
const loadCompletedItems = () => {
  const saved = localStorage.getItem('home_completed_items')
  if (saved) {
    completedItems.value = JSON.parse(saved)
  }
}

// Save completed items to localStorage
const saveCompletedItems = () => {
  localStorage.setItem('home_completed_items', JSON.stringify(completedItems.value))
}

// Compare dates in YYYY-MM-DD format
const compareDates = (date1: string, date2: string) => {
  return date1.localeCompare(date2)
}

// Get visible sections based on current date
const visibleSections = computed(() => {
  return todoData.value.filter(section => {
    if (section.type === 'recurring') {
      // For recurring sections, show if:
      // 1. date_before exists and current date is before it
      // 2. date_after exists and current date is after it
      // 3. no date constraints (both null)
      const beforeCondition = !section.date_before || compareDates(currentDate.value, section.date_before) < 0
      const afterCondition = !section.date_after || compareDates(currentDate.value, section.date_after) > 0
      return beforeCondition && afterCondition
    } else {
      // For one-time sections, show only on the exact date
      return section.date_on === currentDate.value
    }
  })
})

// Toggle item completion
const toggleItem = (sectionTitle: string, itemText: string) => {
  const key = `${sectionTitle}-${itemText}`
  completedItems.value[key] = !completedItems.value[key]
  saveCompletedItems()
}

// Check if item is completed
const isItemCompleted = (sectionTitle: string, itemText: string) => {
  const key = `${sectionTitle}-${itemText}`
  return completedItems.value[key] || false
}

// Load todo data from JSON file
const loadTodoData = async () => {
  try {
    const response = await fetch('/data/home_todo.json')
    const data = await response.json()
    todoData.value = data
  } catch (error) {
    console.error('Failed to load todo data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  loadCompletedItems()
  await loadTodoData()
})
</script>

<style scoped>
.dynamic-checklist {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.checklist-section {
  background: #fff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

  /* border: 1px solid #ccc; */


h2 {
  margin: 0 0 1rem;
  font-size: 1.25rem;
  color: var(--primary-color);
}

.checklist {
  list-style: none;
  padding: 0;
  margin: 0;
}

.checklist-item {
  margin-bottom: 0.5rem;
}

.checklist-item:last-child {
  margin-bottom: 0;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

input[type="checkbox"] {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
}

.completed {
  text-decoration: line-through;
  color: var(--text-color);
  opacity: 0.6;
}

.loading, .no-sections {
  text-align: center;
  padding: 2rem;
  color: var(--text-color);
  opacity: 0.8;
}
</style> 