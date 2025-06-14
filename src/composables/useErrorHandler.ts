import { ref } from 'vue'
import type { Ref } from 'vue'

interface ErrorHandlerOptions {
  onError?: (error: Error) => void
  showInConsole?: boolean
}

export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const { onError, showInConsole = true } = options
  const error: Ref<string | null> = ref(null)

  const handleError = (err: unknown) => {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
    error.value = errorMessage

    if (showInConsole) {
      console.error('Error:', errorMessage)
    }

    onError?.(err instanceof Error ? err : new Error(errorMessage))
  }

  const clearError = () => {
    error.value = null
  }

  return {
    error,
    handleError,
    clearError
  }
} 