<template>
  <Container>
    <div class="calendar">
      <h1>Calendar</h1>

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
import { ref, onMounted, computed } from 'vue'
import { useAppStore } from '../stores/app'
import Container from '../components/Container.vue'
import type { CalendarEvent } from '../types/types'

const store = useAppStore()

// Mock data for now - will be replaced with ICS parsing
const defaultEvents: CalendarEvent[] = [
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

const importedEvents = ref<CalendarEvent[]>([])
const groupedEvents = computed(() => {
  const allEvents = [...defaultEvents, ...importedEvents.value]
  return groupEventsByDate(allEvents)
})

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

// Parse ICS file content
const parseICS = (content: string): CalendarEvent[] => {
  console.log('Starting ICS parsing...')
  const events: CalendarEvent[] = []
  const lines = content.split('\n')
  let currentEvent: Partial<CalendarEvent> = {}
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    if (line === 'BEGIN:VEVENT') {
      currentEvent = {}
    } else if (line === 'END:VEVENT') {
      if (currentEvent.uid && currentEvent.summary && currentEvent.start && currentEvent.end) {
        console.log('Found complete event:', currentEvent)
        events.push(currentEvent as CalendarEvent)
      }
      currentEvent = {}
    } else if (line.startsWith('UID:')) {
      currentEvent.uid = line.substring(4)
    } else if (line.startsWith('SUMMARY:')) {
      currentEvent.summary = line.substring(8)
    } else if (line.startsWith('DTSTART')) {
      // Handle both with and without timezone
      const dateStr = line.includes(';') 
        ? line.split(':')[1] 
        : line.substring(8)
      currentEvent.start = formatICSDate(dateStr)
    } else if (line.startsWith('DTEND')) {
      // Handle both with and without timezone
      const dateStr = line.includes(';') 
        ? line.split(':')[1] 
        : line.substring(6)
      currentEvent.end = formatICSDate(dateStr)
    } else if (line.startsWith('LOCATION:')) {
      currentEvent.location = line.substring(9)
    }
  }
  
  console.log('Parsed events:', events)
  return events
}

// Format ICS date to ISO string
const formatICSDate = (dateStr: string): string => {
  // Remove any timezone identifier
  dateStr = dateStr.replace(/[A-Z]$/, '')
  
  // Handle both date-only and date-time formats
  if (dateStr.length === 8) {
    // Date only (YYYYMMDD)
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}T00:00:00`
  } else {
    // Date-time (YYYYMMDDTHHMMSS)
    const date = dateStr.slice(0, 8)
    const time = dateStr.slice(9)
    return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}T${time.slice(0, 2)}:${time.slice(2, 4)}:${time.slice(4, 6)}`
  }
}

// Handle file import
const handleFileImport = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) {
    console.log('No file selected')
    return
  }

  console.log('File selected:', file.name)
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      console.log('File content loaded, length:', content.length)
      const events = parseICS(content)
      
      // Add custom prefix to IDs to avoid conflicts
      const processedEvents = events.map(event => ({
        ...event,
        uid: `custom_${event.uid}`
      }))
      
      console.log('Processed events:', processedEvents)
      importedEvents.value = processedEvents
      
      // Update store state
      if (!store.customData) {
        store.customData = {}
      }
      store.customData.calendar = processedEvents
      store.saveToLocalStorage()
      
      // Verify the save
      const verifyState = localStorage.getItem('vegas-app-state')
      console.log('Verified saved state:', verifyState)
    } catch (error) {
      console.error('Failed to parse ICS file:', error)
    }
  }
  reader.onerror = (error) => {
    console.error('Error reading file:', error)
  }
  reader.readAsText(file)
}

onMounted(() => {
  // Load store state
  store.loadFromLocalStorage()
  
  // Initialize imported events from store
  if (store.customData?.calendar) {
    console.log('Loading calendar events from store:', store.customData.calendar)
    importedEvents.value = store.customData.calendar
  }
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