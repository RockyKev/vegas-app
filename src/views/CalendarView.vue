<template>
  <Container>
    <div class="calendar">
      <h1>Calendar</h1>
      <div class="calendar-content">
        <div v-for="(events, date) in groupedEvents" :key="date" class="day-card card">
          <h2>{{ formatDate(date) }}</h2>
          <div class="events-list">
            <div 
              v-for="event in events" 
              :key="event.uid"
              class="event-item"
              :class="{ 'completed': isEventDone(event.uid) }"
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
                @click="toggleEventDone(event.uid)"
                :aria-label="isEventDone(event.uid) ? 'Mark as not done' : 'Mark as done'"
              >
                {{ isEventDone(event.uid) ? '✓' : '○' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAppStore } from '../stores/app'
import Container from '../components/Container.vue'
import type { CalendarEvent } from '../types/types'

const store = useAppStore()

// Mock data for now - will be replaced with ICS parsing
const mockEvents: CalendarEvent[] = [
  {
    uid: '1',
    summary: 'Arrival at Las Vegas Airport',
    start: '2024-07-10T14:00:00',
    end: '2024-07-10T15:00:00',
    location: 'LAS Terminal 1'
  },
  {
    uid: '2',
    summary: 'Conference Registration',
    start: '2024-07-10T16:00:00',
    end: '2024-07-10T17:00:00',
    location: 'Venetian Convention Center'
  },
  {
    uid: '3',
    summary: 'Welcome Reception',
    start: '2024-07-10T18:00:00',
    end: '2024-07-10T20:00:00',
    location: 'Wynn Las Vegas'
  }
]

const groupedEvents = ref<Record<string, CalendarEvent[]>>({})

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })
}

const isEventDone = (eventId: string) => {
  return store.calendarDone[eventId] || false
}

const toggleEventDone = (eventId: string) => {
  store.markEventAsDone(eventId)
}

const groupEventsByDate = (events: CalendarEvent[]) => {
  const grouped: Record<string, CalendarEvent[]> = {}
  events.forEach(event => {
    const date = event.start.split('T')[0]
    if (!grouped[date]) {
      grouped[date] = []
    }
    grouped[date].push(event)
  })
  return grouped
}

onMounted(() => {
  store.loadFromLocalStorage()
  groupedEvents.value = groupEventsByDate(mockEvents)
})
</script>

<style scoped>
.calendar {
  padding: 1rem 0;
}

h1 {
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  color: var(--text-color);
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
  gap: 1rem;
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