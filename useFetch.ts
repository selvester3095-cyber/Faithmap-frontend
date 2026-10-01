import { useState, useEffect } from 'react'
import { AxiosError } from 'axios'

interface UseFetchReturn<T> {
  data: T | null
  isLoading: boolean
  error: AxiosError | null
  refetch: () => void
}

export const useFetch = <T,>(
  fetchFn: () => Promise<T>,
  dependencies: React.DependencyList = []
): UseFetchReturn<T> => {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<AxiosError | null>(null)

  const fetch = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await fetchFn()
      setData(result)
    } catch (err) {
      setError(err as AxiosError)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetch()
  }, dependencies)

  const refetch = () => {
    fetch()
  }

  return { data, isLoading, error, refetch }
}
