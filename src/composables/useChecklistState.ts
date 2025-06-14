import { computed } from 'vue'
import { useAppStore } from '../stores/app'

export function useChecklistState() {
  const store = useAppStore()
  const completedItems = computed(() => store.homeCompletedItems || {})

  const toggleItem = (sectionTitle: string, itemText: string) => {
    const key = `${sectionTitle}-${itemText}`
    if (!store.homeCompletedItems) {
      store.homeCompletedItems = {}
    }
    store.homeCompletedItems[key] = !store.homeCompletedItems[key]
    store.saveToLocalStorage()
  }

  const isItemCompleted = (sectionTitle: string, itemText: string) => {
    const key = `${sectionTitle}-${itemText}`
    return store.homeCompletedItems?.[key] || false
  }

  return {
    completedItems,
    toggleItem,
    isItemCompleted
  }
} 