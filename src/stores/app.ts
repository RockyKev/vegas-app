import { defineStore } from 'pinia'

interface AppState {
  tipsRead: Record<string, boolean>
  tipsStarred: Record<string, boolean>
  calendarDone: Record<string, boolean>
  peopleStatus: Record<string, 'not-met' | 'connected' | 'followed-up'>
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    tipsRead: {},
    tipsStarred: {},
    calendarDone: {},
    peopleStatus: {}
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

    // Calendar actions
    markEventAsDone(eventId: string) {
      this.calendarDone[eventId] = true
      this.saveToLocalStorage()
    },

    // People status actions
    updatePersonStatus(personId: string, status: 'not-met' | 'connected' | 'followed-up') {
      this.peopleStatus[personId] = status
      this.saveToLocalStorage()
    },

    // Local storage actions
    saveToLocalStorage() {
      const state = {
        tipsRead: this.tipsRead,
        tipsStarred: this.tipsStarred,
        calendarDone: this.calendarDone,
        peopleStatus: this.peopleStatus
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
      }
    }
  }
}) 