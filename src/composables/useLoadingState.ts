import { ref } from 'vue'
import type { Ref } from 'vue'

interface LoadingStateOptions {
  initialValue?: boolean
  onStateChange?: (isLoading: boolean) => void
}

export function useLoadingState(options: LoadingStateOptions = {}) {
  const { initialValue = false, onStateChange } = options
  const isLoading: Ref<boolean> = ref(initialValue)

  const setLoading = (value: boolean) => {
    isLoading.value = value
    onStateChange?.(value)
  }

  const withLoading = async <T>(promise: Promise<T>): Promise<T> => {
    setLoading(true)
    try {
      return await promise
    } finally {
      setLoading(false)
    }
  }

  return {
    isLoading,
    setLoading,
    withLoading
  }
} 