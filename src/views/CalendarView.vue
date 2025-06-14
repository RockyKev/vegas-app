<template>
  <Container>
    <div class="calendar">
      <div class="header-row">
        <h1>Calendar</h1>
        <HelpToggle>
          <h3>Calendar Help</h3>
          <p>Import your calendar events by clicking the "Import Calendar" button and selecting an ICS file.</p>
          <p>You can mark events as completed by clicking the circle next to each event.</p>
          <p>Events are automatically sorted by date and time.</p>
          <p>If you don't import any events, default events will be shown.</p>
        </HelpToggle>
      </div>

      <!-- Import Section -->
      <div class="import-section">
        <input 
          type="file" 
          accept=".ics" 
          @change="handleFileImport" 
          class="file-input"
          id="calendar-import"
        >
        <label for="calendar-import" class="import-button">
          Import Calendar (ICS)
        </label>
      </div>

      <!-- Calendar Content -->
      <div class="calendar-content">
        <div v-for="(events, date) in groupedEvents" :key="date" class="day-card card">
          <h2>{{ formatDate(date) }}</h2>
          <div class="events-list">
            <div 
              v-for="event in events" 
              :key="event.id"
              class="event-item"
              :class="{ 'completed': event.status === 'completed' }"
            >
              <div class="event-time">{{ formatTime(event.start) }}</div>
              <div class="event-details">
                <h3>{{ event.summary }}</h3>
                <p v-if="event.location" class="event-location">
                  📍 {{ event.location }}
                </p>
              </div>
              <button 
                class="check-button"
                @click="toggleEventStatus(event.id)"
                :aria-label="event.status === 'completed' ? 'Mark as not done' : 'Mark as done'"
              >
                {{ event.status === 'completed' ? '✓' : '○' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import Container from '../components/Container.vue'
import HelpToggle from '../components/HelpToggle.vue'
import type { CalendarEvent } from '../types/types'
import { useCalendarData } from '../composables/useCalendarData'
import { useAppStore } from '../stores/app'

// Initialize composables
const store = useAppStore()
const {
  events,
  loadDefaultCalendar,
  handleImportedCalendar,
  toggleEventStatus
} = useCalendarData()

// Group events by date
const groupedEvents = computed(() => {
  const grouped: Record<string, CalendarEvent[]> = {}
  
  events.value.forEach(event => {
    // Get the date part of the start time, ensuring we use local timezone
    const startDate = event.start instanceof Date ? event.start : new Date(event.start)
    // Format the date in YYYY-MM-DD format using local timezone
    const dateKey = startDate.toLocaleDateString('en-CA') // This gives YYYY-MM-DD format
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }
    grouped[dateKey].push(event)
  })
  
  // Sort events within each day by start time
  Object.keys(grouped).forEach(date => {
    grouped[date].sort((a, b) => {
      const aStart = a.start instanceof Date ? a.start : new Date(a.start)
      const bStart = b.start instanceof Date ? b.start : new Date(b.start)
      return aStart.getTime() - bStart.getTime()
    })
  })
  
  return grouped
})

// Custom ICS file handling
const handleFileImport = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  try {
    await handleImportedCalendar(file)
  } catch (err) {
    console.error('Error importing calendar:', err)
  }
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date:', date)
    return 'Invalid Time'
  }
  return dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })
}

onMounted(async () => {
  try {
    // Load from localStorage first
    store.loadFromLocalStorage()
    
    // Then load default calendar if no events exist
    if (!store.customData?.calendar?.length) {
      await loadDefaultCalendar()
    }
  } catch (err) {
    console.error('Error in onMounted:', err)
  }
})
</script>

<style scoped>
.calendar {
  padding: 1rem 0;
}

.header-row {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

h1 {
  margin: 0;
  font-size: 1.75rem;
  color: var(--text-color);
}

.import-section {
  margin-bottom: 2rem;
}

.file-input {
  display: none;
}

.import-button {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.import-button:hover {
  background-color: var(--primary-color-dark);
}

.calendar-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.day-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h2 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: var(--text-color);
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.5rem;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.event-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.event-item:hover {
  background-color: #f8f9fa;
}

.event-item.completed {
  opacity: 0.7;
}

.event-time {
  min-width: 80px;
  font-weight: 500;
  color: var(--primary-color);
}

.event-details {
  flex: 1;
}

h3 {
  margin: 0;
  font-size: 1rem;
  color: var(--text-color);
}

.event-location {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: #666;
}

.check-button {
  background: none;
  border: none;
  width: 24px;
  height: 24px;
  padding: 0;
  cursor: pointer;
  font-size: 1.25rem;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.check-button:hover {
  color: var(--primary-color);
}

/* Tablet and up */
@media (min-width: 768px) {
  h1 {
    font-size: 2rem;
  }

  .calendar-content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}
</style> 