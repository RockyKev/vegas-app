import { ref } from 'vue'

interface ImportOptions<T> {
  validator: (data: unknown) => data is T[]
  onSuccess?: (data: T[]) => void
  onError?: (error: Error) => void
}

export function useImportData<T>(options: ImportOptions<T>) {
  const isImporting = ref(false)
  const importError = ref<string | null>(null)

  const handleFileImport = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) {
      console.log('No file selected')
      return
    }

    isImporting.value = true
    importError.value = null
    console.log('File selected:', file.name)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)
        
        if (!options.validator(data)) {
          throw new Error('Invalid data format')
        }
        
        console.log('Processed data:', data)
        options.onSuccess?.(data)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to parse file'
        console.error('Import error:', errorMessage)
        importError.value = errorMessage
        options.onError?.(error instanceof Error ? error : new Error(errorMessage))
      } finally {
        isImporting.value = false
      }
    }

    reader.onerror = (error) => {
      const errorMessage = 'Error reading file'
      console.error(errorMessage, error)
      importError.value = errorMessage
      options.onError?.(new Error(errorMessage))
      isImporting.value = false
    }

    reader.readAsText(file)
  }

  return {
    isImporting,
    importError,
    handleFileImport
  }
} 