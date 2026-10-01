// Church Types
export interface Church {
  id: number
  church_name: string
  email: string
  phone?: string
  location: string
  description?: string
  image_url?: string
  created_at: string
  updated_at: string
}

// Event Types
export interface Event {
  id: number
  church_id: number
  title: string
  description?: string
  start_time: string
  end_time: string
  location: string
  category: string
  is_published: boolean
  interested_count: number
  created_at: string
  updated_at: string
  church?: Church
  distance?: string
  language?: string
  verified?: boolean
}

// Church Settings Types
export interface ChurchSettings {
  id: number
  church_id: number
  email_on_interest: boolean
  daily_digest: boolean
  event_reminders: boolean
  reminder_hours_before: number
  created_at: string
  updated_at: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}

// Filter Types
export interface EventFilters {
  category?: string
  date?: string
  language?: string
  distance?: number
  sortBy?: 'nearest' | 'soonest'
}

export interface SearchParams {
  location?: string
  date?: string
  church?: string
}

// UI State Types
export interface LoadingState {
  isLoading: boolean
  error?: string
}

export interface UserLocation {
  latitude: number
  longitude: number
  address?: string
}
