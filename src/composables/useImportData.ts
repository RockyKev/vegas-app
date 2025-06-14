import { ref } from 'vue'
import { useFileValidation } from './useFileValidation'

interface ImportOptions<T> {
  validator: (data: unknown) => data is T[]
  onSuccess?: (data: T[]) => void
  onError?: (error: Error) => void
  allowedTypes: string[]
  hasExistingData: () => boolean
}

export function useImportData<T>(options: ImportOptions<T>) {
  const isImporting = ref(false)
  const importError = ref<string | null>(null)
  const { validateFile, validationError } = useFileValidation()

  const handleFileImport = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) {
      console.log('No file selected')
      return
    }

    // Validate file before processing
    if (!validateFile(file, options.allowedTypes)) {
      importError.value = validationError.value
      options.onError?.(new Error(validationError.value || 'File validation failed'))
      return
    }

    // Show warning if there's existing data
    if (options.hasExistingData()) {
      const confirmed = window.confirm(
        'Warning: Importing a new file will replace your existing custom data. Are you sure you want to continue?'
      )
      if (!confirmed) {
        // Reset the file input
        (event.target as HTMLInputElement).value = ''
        return
      }
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