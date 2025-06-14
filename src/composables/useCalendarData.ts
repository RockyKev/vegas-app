import { ref } from 'vue'
import { useAppStore } from '../stores/app'
import type { CalendarEvent } from '../types/types'

export function useCalendarData() {
  const store = useAppStore()
  const events = ref<CalendarEvent[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const parseICS = (content: string): CalendarEvent[] => {
    console.log('Starting ICS parsing')
    const parsedEvents: CalendarEvent[] = []
    
    // Normalize line endings and handle line continuations
    const normalizedContent = content
      .replace(/\r\n /g, '') // Remove line continuations
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\n /g, '') // Remove remaining line continuations
    
    console.log('Normalized content:', normalizedContent)
    
    const lines = normalizedContent.split('\n')
    let currentEvent: Partial<CalendarEvent> | null = null
    let inEvent = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      console.log('Processing line:', line)
      
      if (line === 'BEGIN:VEVENT') {
        console.log('Found VEVENT start')
        inEvent = true
        currentEvent = {}
      } else if (line === 'END:VEVENT' && currentEvent) {
        console.log('Found VEVENT end, current event:', currentEvent)
        inEvent = false
        if (currentEvent.summary && currentEvent.start && currentEvent.end) {
          parsedEvents.push({
            id: currentEvent.id || `event_${Math.random().toString(36).substr(2, 9)}`,
            summary: currentEvent.summary,
            start: currentEvent.start,
            end: currentEvent.end,
            location: currentEvent.location,
            description: currentEvent.description,
            status: currentEvent.status || 'pending'
          })
        }
        currentEvent = null
      } else if (inEvent && currentEvent) {
        // Split on first colon to handle property parameters
        const colonIndex = line.indexOf(':')
        if (colonIndex === -1) continue
        
        const fullKey = line.substring(0, colonIndex)
        const value = line.substring(colonIndex + 1)
        
        // Get the base property name (before any semicolon)
        const key = fullKey.split(';')[0]
        
        console.log('Processing event property:', { key, fullKey, value })

        switch (key) {
          case 'SUMMARY':
            currentEvent.summary = value
            break
          case 'DTSTART':
            // Handle both date-only and date-time formats with timezone
            const startMatch = value.match(/(\d{8}(?:T\d{6})?)/)
            console.log('DTSTART match:', startMatch)
            if (startMatch) {
              const dateTime = startMatch[1]
              console.log('DTSTART parsed:', { dateTime })
              // Format: YYYYMMDDTHHMMSS
              const year = dateTime.substring(0, 4)
              const month = dateTime.substring(4, 6)
              const day = dateTime.substring(6, 8)
              const hour = dateTime.substring(9, 11) || '00'
              const minute = dateTime.substring(11, 13) || '00'
              const second = dateTime.substring(13, 15) || '00'
              
              const dateStr = `${year}-${month}-${day}T${hour}:${minute}:${second}`
              console.log('DTSTART formatted:', dateStr)
              const startDate = new Date(dateStr)
              if (!isNaN(startDate.getTime())) {
                currentEvent.start = startDate
                console.log('DTSTART set:', startDate)
              } else {
                console.log('Invalid DTSTART date:', dateStr)
              }
            }
            break
          case 'DTEND':
            // Handle both date-only and date-time formats with timezone
            const endMatch = value.match(/(\d{8}(?:T\d{6})?)/)
            console.log('DTEND match:', endMatch)
            if (endMatch) {
              const dateTime = endMatch[1]
              console.log('DTEND parsed:', { dateTime })
              // Format: YYYYMMDDTHHMMSS
              const year = dateTime.substring(0, 4)
              const month = dateTime.substring(4, 6)
              const day = dateTime.substring(6, 8)
              const hour = dateTime.substring(9, 11) || '00'
              const minute = dateTime.substring(11, 13) || '00'
              const second = dateTime.substring(13, 15) || '00'
              
              const dateStr = `${year}-${month}-${day}T${hour}:${minute}:${second}`
              console.log('DTEND formatted:', dateStr)
              const endDate = new Date(dateStr)
              if (!isNaN(endDate.getTime())) {
                currentEvent.end = endDate
                console.log('DTEND set:', endDate)
              } else {
                console.log('Invalid DTEND date:', dateStr)
              }
            }
            break
          case 'LOCATION':
            currentEvent.location = value
            break
          case 'DESCRIPTION':
            currentEvent.description = value
            break
          case 'UID':
            currentEvent.id = value
            break
        }
      }
    }

    console.log('Parsed events:', parsedEvents)
    return parsedEvents
  }

  const loadDefaultCalendar = async () => {
    console.log('Loading default calendar...')
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch('/data/calendar.ics')
      if (!response.ok) {
        throw new Error(`Failed to load calendar: ${response.statusText}`)
      }

      const content = await response.text()
      console.log('Loaded ICS content:', content.substring(0, 100) + '...')
      
      const parsedEvents = parseICS(content)
      if (parsedEvents.length === 0) {
        throw new Error('No events found in calendar')
      }

      events.value = parsedEvents
      console.log('Default calendar loaded:', parsedEvents)
    } catch (err) {
      console.error('Error loading calendar:', err)
      error.value = err instanceof Error ? err.message : 'Failed to load calendar'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const handleImportedCalendar = async (file: File) => {
    console.log('Handling imported calendar:', file.name)
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
      store.customData.calendar = parsedEvents
      store.saveToLocalStorage()

      // Update local state
      events.value = [...events.value, ...parsedEvents]
      console.log('Imported calendar loaded:', parsedEvents)
    } catch (err) {
      console.error('Error importing calendar:', err)
      error.value = err instanceof Error ? err.message : 'Failed to import calendar'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const initializeFromStore = () => {
    console.log('Initializing calendar from store:', store.customData)
    if (store.customData?.calendar) {
      const storeEvents = store.customData.calendar as CalendarEvent[]
      if (Array.isArray(storeEvents)) {
        events.value = [...events.value, ...storeEvents]
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