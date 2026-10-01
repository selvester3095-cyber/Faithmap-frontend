import apiClient from './client'
import type { Church, PaginatedResponse } from '@/types'

export const churchService = {
  // Get all verified churches
  getChurches: async (params?: {
    skip?: number
    limit?: number
    location?: string
  }) => {
    const response = await apiClient.get<PaginatedResponse<Church>>('/churches', {
      params: {
        skip: params?.skip || 0,
        limit: params?.limit || 20,
        location: params?.location,
      },
    })
    return response.data
  },

  // Get single church by ID with events
  getChurchById: async (churchId: number) => {
    const response = await apiClient.get<Church>(`/churches/${churchId}`)
    return response.data
  },

  // Search churches by name
  searchChurches: async (query: string) => {
    const response = await apiClient.get<Church[]>('/churches/search', {
      params: { q: query },
    })
    return response.data
  },

  // Get nearby churches by coordinates
  getNearbyChurches: async (latitude: number, longitude: number, radiusKm: number = 10) => {
    const response = await apiClient.get<Church[]>('/churches/nearby', {
      params: {
        lat: latitude,
        lng: longitude,
        radius: radiusKm,
      },
    })
    return response.data
  },

  // Get churches by denomination
  getChurchesByDenomination: async (denomination: string) => {
    const response = await apiClient.get<Church[]>('/churches/denomination', {
      params: { denomination },
    })
    return response.data
  },

  // Get churches by location/city
  getChurchesByLocation: async (location: string) => {
    const response = await apiClient.get<Church[]>('/churches/location', {
      params: { location },
    })
    return response.data
  },
}
