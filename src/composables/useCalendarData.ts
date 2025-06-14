import { ref } from 'vue'
import { useAppStore } from '../stores/app'
import type { CalendarEvent } from '../types/types'

export function useCalendarData() {
  const store = useAppStore()
  const events = ref<CalendarEvent[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Load store data from localStorage
  store.loadFromLocalStorage()

  const parseICS = (content: string): CalendarEvent[] => {
    const events: CalendarEvent[] = []
    let currentEvent: Partial<CalendarEvent> | null = null
    let inEvent = false

    // Normalize line endings and handle line continuations
    const normalizedContent = content
      .replace(/\r\n/g, '\n')
      .replace(/\n /g, '')
      .split('\n')

    normalizedContent.forEach(line => {
      if (line === 'BEGIN:VEVENT') {
        inEvent = true
        currentEvent = {}
      } else if (line === 'END:VEVENT') {
        if (currentEvent && currentEvent.id && currentEvent.start && currentEvent.end) {
          events.push(currentEvent as CalendarEvent)
        }
        inEvent = false
        currentEvent = null
      } else if (inEvent && currentEvent) {
        const [fullKey, ...valueParts] = line.split(':')
        const value = valueParts.join(':')
        const key = fullKey.split(';')[0]
        
        if (key === 'DTSTART') {
          const dateTime = value.match(/(\d{8}T\d{6})/)?.[1]
          if (dateTime) {
            const [date, time] = [dateTime.slice(0, 8), dateTime.slice(9)]
            const dateStr = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}T${time.slice(0, 2)}:${time.slice(2, 4)}:${time.slice(4)}`
            currentEvent.start = new Date(dateStr)
          }
        } else if (key === 'DTEND') {
          const dateTime = value.match(/(\d{8}T\d{6})/)?.[1]
          if (dateTime) {
            const [date, time] = [dateTime.slice(0, 8), dateTime.slice(9)]
            const dateStr = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6)}T${time.slice(0, 2)}:${time.slice(2, 4)}:${time.slice(4)}`
            currentEvent.end = new Date(dateStr)
          }
        } else if (key === 'SUMMARY') {
          currentEvent.summary = value
        } else if (key === 'LOCATION') {
          currentEvent.location = value
        } else if (key === 'UID') {
          currentEvent.id = value
        }
      }
    })

    return events
  }

  const loadDefaultCalendar = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch('/data/calendar.ics')
      if (!response.ok) {
        throw new Error('Failed to load default calendar')
      }
      const content = await response.text()
      const parsedEvents = parseICS(content)
      if (parsedEvents.length === 0) {
        throw new Error('No events found in calendar')
      }
      events.value = parsedEvents
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load calendar'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const handleImportedCalendar = async (file: File) => {
    isLoading.value = true
    error.value = null

    try {
      const content = await file.text()
      const parsedEvents = parseICS(content)
      
      if (parsedEvents.length === 0) {
        throw new Error('No events found in imported calendar')
      }

      // Update store
      if (!store.customData) {
        store.customData = {}
      }
      if (!store.customData.calendar) {
        store.customData.calendar = []
      }
      store.customData.calendar = [...store.customData.calendar, ...parsedEvents]
      store.saveToLocalStorage()

      // Update local state
      events.value = [...events.value, ...parsedEvents]
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to import calendar'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const initializeFromStore = () => {
    // Reload from localStorage to ensure we have the latest data
    store.loadFromLocalStorage()
    
    if (store.customData?.calendar) {
      const storeEvents = store.customData.calendar as CalendarEvent[]
      if (Array.isArray(storeEvents)) {
        // Convert date strings back to Date objects
        const processedEvents = storeEvents.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }))
        
        // Merge store events with existing events, avoiding duplicates
        const existingIds = new Set(events.value.map(e => e.id))
        const newEvents = processedEvents.filter(e => !existingIds.has(e.id))
        events.value = [...events.value, ...newEvents]
      }
    }
  }

  return {
    events,
    isLoading,
    error,
    importError: error,
    loadDefaultCalendar,
    handleImportedCalendar,
    initializeFromStore
  }
} 