// Contact interface
export interface Contact {
  id: string
  name: string
  title?: string
  email?: string
  phone?: string
}

// Networking Tip interface
export interface NetworkingTip {
  id: string
  content: string
  source?: string
  source_link?: string
}

// Networking Target interface
export interface NetworkingTarget {
  id: string
  name: string
  title?: string
  department?: string
  connections?: string[]
  personal_details?: string[]
  work_details?: string[]
  questions?: string[]
  status?: 'not-met' | 'connected' | 'followed-up'
}

// Travel Info interface
export interface TravelInfo {
  title: string
  image?: string
  content?: string[]
}

// Calendar Event interface
export interface CalendarEvent {
  uid: string
  summary: string
  start: string
  end: string
  location?: string
}

// App State interface
export interface AppState {
  tipsRead: Record<string, boolean>
  tipsStarred: Record<string, boolean>
  calendarDone: Record<string, boolean>
  peopleStatus: Record<string, 'not-met' | 'connected' | 'followed-up'>
} 