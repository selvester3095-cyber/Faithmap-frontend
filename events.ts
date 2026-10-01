import apiClient from './client'
import type { Event, PaginatedResponse } from '@/types'

export const eventService = {
  // Get all published events with optional filters
  getEvents: async (params?: {
    skip?: number
    limit?: number
    category?: string
    start_date?: string
    end_date?: string
  }) => {
    const response = await apiClient.get<PaginatedResponse<Event>>('/events', {
      params: {
        skip: params?.skip || 0,
        limit: params?.limit || 20,
        category: params?.category,
        start_date: params?.start_date,
        end_date: params?.end_date,
      },
    })
    return response.data
  },

  // Get single event by ID
  getEventById: async (eventId: number) => {
    const response = await apiClient.get<Event>(`/events/${eventId}`)
    return response.data
  },

  // Search events by title
  searchEvents: async (query: string) => {
    const response = await apiClient.get<Event[]>('/events/search', {
      params: { q: query },
    })
    return response.data
  },

  // Mark user as interested in event
  markInterested: async (eventId: number) => {
    const response = await apiClient.post<{ interested_count: number }>(
      `/events/${eventId}/interested`
    )
    return response.data
  },

  // Get nearby events by coordinates
  getNearbyEvents: async (latitude: number, longitude: number, radiusKm: number = 5) => {
    const response = await apiClient.get<Event[]>('/events/nearby', {
      params: {
        lat: latitude,
        lng: longitude,
        radius: radiusKm,
      },
    })
    return response.data
  },

  // Get events by date range
  getEventsByDateRange: async (startDate: string, endDate: string) => {
    const response = await apiClient.get<Event[]>('/events/date-range', {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    })
    return response.data
  },

  // Get upcoming events
  getUpcomingEvents: async (limit: number = 10) => {
    const response = await apiClient.get<Event[]>('/events/upcoming', {
      params: { limit },
    })
    return response.data
  },
}
