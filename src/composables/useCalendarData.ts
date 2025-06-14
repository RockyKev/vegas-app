import { computed } from 'vue'
import { useAppStore } from '../stores/app'
import type { CalendarEvent } from '../types/types'
import { useFileValidation } from './useFileValidation'

export function useCalendarData() {
  const store = useAppStore()
  const { validateFile, validationError } = useFileValidation()

  // Single source of truth - computed from store
  const events = computed(() => {
    if (!store.customData?.calendar) return []
    return store.customData.calendar.map(event => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end)
    }))
  })

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

      // Initialize store if needed
      if (!store.customData) {
        store.customData = {}
      }
      if (!store.customData.calendar) {
        store.customData.calendar = []
      }

      // Add new events with pending status
      const eventsWithStatus = parsedEvents.map(event => ({
        ...event,
        status: 'pending' as const
      }))

      // Merge with existing events, avoiding duplicates
      const existingIds = new Set(store.customData.calendar.map(e => e.id))
      const newEvents = eventsWithStatus.filter(e => !existingIds.has(e.id))
      store.customData.calendar = [...store.customData.calendar, ...newEvents]
      store.saveToLocalStorage()
    } catch (err) {
      throw err
    }
  }

  const handleImportedCalendar = async (file: File) => {
    // Validate file before processing
    if (!validateFile(file, ['.ics', 'text/calendar'])) {
      throw new Error(validationError.value || 'File validation failed')
    }

    try {
      const content = await file.text()
      const parsedEvents = parseICS(content)
      
      if (parsedEvents.length === 0) {
        throw new Error('No events found in imported calendar')
      }

      // Initialize store if needed
      if (!store.customData) {
        store.customData = {}
      }
      if (!store.customData.calendar) {
        store.customData.calendar = []
      }

      // Add new events with pending status
      const eventsWithStatus = parsedEvents.map(event => ({
        ...event,
        status: 'pending' as const
      }))

      // Merge with existing events, avoiding duplicates
      const existingIds = new Set(store.customData.calendar.map(e => e.id))
      const newEvents = eventsWithStatus.filter(e => !existingIds.has(e.id))
      store.customData.calendar = [...store.customData.calendar, ...newEvents]
      store.saveToLocalStorage()
    } catch (err) {
      throw err
    }
  }

  const toggleEventStatus = (eventId: string) => {
    if (!store.customData?.calendar) return

    const eventIndex = store.customData.calendar.findIndex(e => e.id === eventId)
    if (eventIndex === -1) return

    const event = store.customData.calendar[eventIndex]
    const newStatus = event.status === 'completed' ? 'pending' : 'completed'
    
    store.customData.calendar[eventIndex] = {
      ...event,
      status: newStatus
    }
    
    store.saveToLocalStorage()
  }

  return {
    events,
    loadDefaultCalendar,
    handleImportedCalendar,
    toggleEventStatus
  }
} 