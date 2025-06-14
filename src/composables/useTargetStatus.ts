import { useAppStore } from '../stores/app'
import type { NetworkingTarget } from '../types/types'

export type TargetStatus = 'not-met' | 'connected' | 'followed-up'

export function useTargetStatus() {
  const store = useAppStore()

  const getStatusLabel = (status: TargetStatus): string => {
    switch (status) {
      case 'connected':
        return 'Connected'
      case 'followed-up':
        return 'Followed Up'
      default:
        return 'Not Met'
    }
  }

  const getStatusClass = (status: TargetStatus): string => {
    switch (status) {
      case 'connected':
        return 'status-connected'
      case 'followed-up':
        return 'status-followed-up'
      default:
        return 'status-not-met'
    }
  }

  const getTargetStatus = (target: NetworkingTarget): TargetStatus => {
    // First check peopleStatus in store
    const storedStatus = store.peopleStatus[target.id]
    if (storedStatus) {
      // Sync the status back to the target
      target.status = storedStatus as TargetStatus
      return storedStatus as TargetStatus
    }
    // Fall back to target's status
    return target.status || 'not-met'
  }

  const toggleTargetStatus = (target: NetworkingTarget): void => {
    const currentStatus = getTargetStatus(target)
    let newStatus: TargetStatus

    switch (currentStatus) {
      case 'connected':
        newStatus = 'followed-up'
        break
      case 'followed-up':
        newStatus = 'not-met'
        break
      default:
        newStatus = 'connected'
    }

    // Update both places
    target.status = newStatus
    store.updatePersonStatus(target.id, newStatus)
  }

  return {
    getStatusLabel,
    getStatusClass,
    getTargetStatus,
    toggleTargetStatus
  }
} 