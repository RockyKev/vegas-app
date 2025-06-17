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
  tipID?: string // For backward compatibility with existing data
  content: string
  source?: string
  source_link?: string
  sourceLink?: string // For backward compatibility with existing data
  tags?: string[]
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
  id: string
  summary: string
  start: Date
  end: Date
  location?: string
  description?: string
  status?: 'pending' | 'completed'
}

// App State interface
export interface AppState {
  tipsRead: Record<string, boolean>
  tipsStarred: Record<string, boolean>
  calendarDone: Record<string, boolean>
  peopleStatus: Record<string, 'not-met' | 'connected' | 'followed-up'>
} 