/**
 * Format date to readable string
 */
export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format time to readable string
 */
export const formatTime = (time: string): string => {
  const d = new Date(time)
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/**
 * Format date and time together
 */
export const formatDateTime = (dateTime: string): string => {
  const d = new Date(dateTime)
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/**
 * Calculate distance using Haversine formula
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Format distance to readable string
 */
export const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`
  }
  return `${distanceKm.toFixed(1)}km`
}

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text
  return `${text.substring(0, length)}...`
}

/**
 * Capitalize first letter of string
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Format event category for display
 */
export const formatCategory = (category: string): string => {
  return category
    .split('_')
    .map((word) => capitalize(word.toLowerCase()))
    .join(' ')
}
