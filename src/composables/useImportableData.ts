import { ref, computed } from 'vue'
import { useAppStore } from '../stores/app'

type CustomDataKey = 'calendar' | 'networkingTips' | 'contacts' | 'networking'

interface ImportableDataOptions<T> {
  defaultDataPath: string
  storeKey: CustomDataKey
  validator: (data: unknown) => data is T[]
  processImportedData?: (data: T[]) => T[]
}

export function useImportableData<T extends { id: string }>(options: ImportableDataOptions<T>) {
  const store = useAppStore()
  const defaultData = ref<T[]>([])
  const importedData = ref<T[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Combine default and imported data based on useDefaultData setting
  const allData = computed(() => {
    if (!store.useDefaultData) {
      return importedData.value
    }
    const importedIds = new Set(importedData.value.map(item => item.id))
    const uniqueDefaultData = defaultData.value.filter(item => !importedIds.has(item.id))
    return [...importedData.value, ...uniqueDefaultData]
  })

  // Load default data
  const loadDefaultData = async () => {
    // Skip loading default data if useDefaultData is false
    if (!store.useDefaultData) {
      console.log('Skipping default data load - useDefaultData is false')
      return
    }

    console.log('Loading default data from:', options.defaultDataPath)
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(options.defaultDataPath)
      if (!response.ok) {
        throw new Error(`Failed to fetch default data: ${response.statusText}`)
      }
      const data = await response.json()
      console.log('Fetched default data:', data)
      
      if (!options.validator(data)) {
        throw new Error('Invalid default data format')
      }

      // Process the data if a processor is provided
      const processedData = options.processImportedData?.(data) || data
      defaultData.value = processedData
      console.log('Default data set:', defaultData.value)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load default data'
      console.error('Error loading default data:', errorMessage)
      error.value = errorMessage
      throw err // Re-throw to be handled by the component
    } finally {
      isLoading.value = false
    }
  }

  // Handle imported data
  const handleImportedData = (data: T[]) => {
    console.log('Handling imported data:', data)
    const processedData = options.processImportedData?.(data) || data
    importedData.value = processedData
    
    // Update store state
    if (!store.customData) {
      store.customData = {}
    }
    store.customData[options.storeKey] = processedData
    store.saveToLocalStorage()
    console.log('Imported data saved to store')
  }

  // Initialize from store
  const initializeFromStore = () => {
    console.log('Initializing from store, current store state:', store.customData)
    store.loadFromLocalStorage()
    if (store.customData?.[options.storeKey]) {
      const storedData = store.customData[options.storeKey] as T[]
      if (options.validator(storedData)) {
        importedData.value = storedData
        console.log('Imported data loaded from store:', importedData.value)
      }
    }
  }

  return {
    defaultData,
    importedData,
    allData,
    isLoading,
    error,
    loadDefaultData,
    handleImportedData,
    initializeFromStore
  }
} 