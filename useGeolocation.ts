import { useState, useCallback } from 'react'
import type { UserLocation } from '@/types'

interface UseGeolocationReturn {
  location: UserLocation | null
  isLoading: boolean
  error: string | null
  requestLocation: () => Promise<UserLocation | null>
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [location, setLocation] = useState<UserLocation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestLocation = useCallback(async (): Promise<UserLocation | null> => {
    setIsLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setIsLoading(false)
      return null
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation: UserLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
          setLocation(userLocation)
          setIsLoading(false)
          resolve(userLocation)
        },
        (err) => {
          let errorMessage = 'Unable to retrieve your location'
          if (err.code === err.PERMISSION_DENIED) {
            errorMessage = 'Location permission denied. Please enable location access in your browser settings.'
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            errorMessage = 'Location information is unavailable.'
          } else if (err.code === err.TIMEOUT) {
            errorMessage = 'The request to get user location timed out.'
          }
          setError(errorMessage)
          setIsLoading(false)
          resolve(null)
        }
      )
    })
  }, [])

  return { location, isLoading, error, requestLocation }
}
