import create from 'zustand'
import type { Event, EventFilters } from '@/types'

interface EventStore {
  events: Event[]
  selectedEvent: Event | null
  filters: EventFilters
  isLoading: boolean
  error: string | null

  setEvents: (events: Event[]) => void
  setSelectedEvent: (event: Event | null) => void
  setFilters: (filters: EventFilters) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearFilters: () => void
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  selectedEvent: null,
  filters: {},
  isLoading: false,
  error: null,

  setEvents: (events) => set({ events }),
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  setFilters: (filters) => set({ filters }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearFilters: () => set({ filters: {} }),
}))
