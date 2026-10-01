import create from 'zustand'
import type { Church } from '@/types'

interface ChurchStore {
  churches: Church[]
  selectedChurch: Church | null
  searchTerm: string
  isLoading: boolean
  error: string | null

  setChurches: (churches: Church[]) => void
  setSelectedChurch: (church: Church | null) => void
  setSearchTerm: (term: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useChurchStore = create<ChurchStore>((set) => ({
  churches: [],
  selectedChurch: null,
  searchTerm: '',
  isLoading: false,
  error: null,

  setChurches: (churches) => set({ churches }),
  setSelectedChurch: (church) => set({ selectedChurch: church }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))
