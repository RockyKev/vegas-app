import { defineStore } from 'pinia'
import type { AppState } from '../types/types'

interface Error {
  message: string
  timestamp: number
  stack?: string
}

interface ExtendedAppState extends AppState {
  customData?: {
    calendar?: any[]
    networkingTips?: any[]
    contacts?: any[]
    networking?: any[]
  }
  homeCompletedItems?: Record<string, boolean>
  useDefaultData?: boolean
  tipsHidden?: Record<string, boolean>
}

export const useAppStore = defineStore('app', {
  state: (): ExtendedAppState & { errors: Error[] } => ({
    tipsRead: {},
    tipsStarred: {},
    calendarDone: {},
    peopleStatus: {},
    errors: [],
    customData: {},
    homeCompletedItems: {},
    useDefaultData: true, // Default to true to maintain current behavior
    tipsHidden: {}
  }),

  actions: {
    // Tips actions
    markTipAsRead(tipId: string) {
      this.tipsRead[tipId] = true
      this.saveToLocalStorage()
    },

    toggleTipStar(tipId: string) {
      this.tipsStarred[tipId] = !this.tipsStarred[tipId]
      this.saveToLocalStorage()
    },

    toggleTipHidden(tipId: string) {
      if (!this.tipsHidden) {
        this.tipsHidden = {}
      }
      this.tipsHidden[tipId] = !this.tipsHidden[tipId]
      this.saveToLocalStorage()
    },

    // Calendar actions
    markEventAsDone(eventId: string) {
      this.calendarDone[eventId] = !this.calendarDone[eventId]
      this.saveToLocalStorage()
    },

    // People status actions
    updatePersonStatus(personId: string, status: 'not-met' | 'connected' | 'followed-up') {
      this.peopleStatus[personId] = status
      this.saveToLocalStorage()
    },

    // Data mode toggle
    toggleDefaultDataMode() {
      this.useDefaultData = !this.useDefaultData
      this.saveToLocalStorage()
    },

    // Error logging
    logError(error: Error) {
      console.error('Application Error:', error)
      this.errors.push({
        message: error.message,
        timestamp: Date.now(),
        stack: error.stack
      })
      // Keep only the last 10 errors
      if (this.errors.length > 10) {
        this.errors.shift()
      }
      this.saveToLocalStorage()
    },

    // Local storage actions
    saveToLocalStorage() {
      const state = {
        tipsRead: this.tipsRead,
        tipsStarred: this.tipsStarred,
        calendarDone: this.calendarDone,
        peopleStatus: this.peopleStatus,
        errors: this.errors,
        customData: this.customData,
        homeCompletedItems: this.homeCompletedItems,
        useDefaultData: this.useDefaultData,
        tipsHidden: this.tipsHidden
      }
      localStorage.setItem('vegas-app-state', JSON.stringify(state))
    },

    loadFromLocalStorage() {
      const savedState = localStorage.getItem('vegas-app-state')
      if (savedState) {
        const state = JSON.parse(savedState)
        this.tipsRead = state.tipsRead || {}
        this.tipsStarred = state.tipsStarred || {}
        this.calendarDone = state.calendarDone || {}
        this.peopleStatus = state.peopleStatus || {}
        this.errors = state.errors || []
        this.customData = state.customData || {}
        this.homeCompletedItems = state.homeCompletedItems || {}
        this.useDefaultData = state.useDefaultData !== undefined ? state.useDefaultData : true
        this.tipsHidden = state.tipsHidden || {}
      }
    },

    // Import/Export actions
    exportState(): string {
      const state = {
        tipsRead: this.tipsRead,
        tipsStarred: this.tipsStarred,
        calendarDone: this.calendarDone,
        peopleStatus: this.peopleStatus,
        customData: this.customData,
        homeCompletedItems: this.homeCompletedItems,
        useDefaultData: this.useDefaultData,
        tipsHidden: this.tipsHidden
      }
      return JSON.stringify(state, null, 2)
    },

    importState(jsonString: string): boolean {
      try {
        const state = JSON.parse(jsonString)
        
        // Validate the imported state
        if (!this.validateState(state)) {
          throw new Error('Invalid state format')
        }

        // Update the store with imported state
        this.tipsRead = state.tipsRead || {}
        this.tipsStarred = state.tipsStarred || {}
        this.calendarDone = state.calendarDone || {}
        this.peopleStatus = state.peopleStatus || {}
        this.customData = state.customData || {}
        this.homeCompletedItems = state.homeCompletedItems || {}
        this.useDefaultData = state.useDefaultData !== undefined ? state.useDefaultData : true
        this.tipsHidden = state.tipsHidden || {}
        
        // Save to localStorage
        this.saveToLocalStorage()
        return true
      } catch (error) {
        const appError: Error = {
          message: error instanceof Error ? error.message : 'Failed to import state',
          timestamp: Date.now(),
          stack: error instanceof Error ? error.stack : undefined
        }
        this.logError(appError)
        return false
      }
    },

    validateState(state: any): state is ExtendedAppState {
      return (
        typeof state === 'object' &&
        state !== null &&
        typeof state.tipsRead === 'object' &&
        typeof state.tipsStarred === 'object' &&
        typeof state.calendarDone === 'object' &&
        typeof state.peopleStatus === 'object' &&
        (!state.customData || typeof state.customData === 'object') &&
        (!state.homeCompletedItems || typeof state.homeCompletedItems === 'object') &&
        (state.useDefaultData === undefined || typeof state.useDefaultData === 'boolean') &&
        (!state.tipsHidden || typeof state.tipsHidden === 'object')
      )
    }
  }
}) 