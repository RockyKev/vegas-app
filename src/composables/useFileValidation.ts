import { ref } from 'vue'
import { useOfflineDetection } from './useOfflineDetection'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB in bytes

export function useFileValidation() {
  const { isOffline } = useOfflineDetection()
  const validationError = ref<string | null>(null)

  const validateFile = (file: File, allowedTypes: string[]): boolean => {
    validationError.value = null

    // Check if offline
    if (isOffline.value) {
      validationError.value = 'Cannot import files while offline'
      return false
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      validationError.value = `File size exceeds 2MB limit (${(file.size / 1024 / 1024).toFixed(2)}MB)`
      return false
    }

    // Check file type
    const fileType = file.type.toLowerCase()
    const isValidType = allowedTypes.some(type => {
      if (type.startsWith('.')) {
        // Handle file extensions
        return file.name.toLowerCase().endsWith(type.toLowerCase())
      }
      // Handle MIME types
      return fileType === type.toLowerCase()
    })

    if (!isValidType) {
      validationError.value = `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
      return false
    }

    return true
  }

  return {
    validationError,
    validateFile,
    MAX_FILE_SIZE
  }
} 