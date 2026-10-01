import { useState, useEffect } from 'react'
import { churchService } from '@/api/churches'
import { ChurchCard } from '@/components/ChurchCard'
import { LoadingSkeletons } from '@/components/Loading'
import { EmptyState, Error } from '@/components/Error'
import { useChurchStore } from '@/store/useChurchStore'

export const ChurchesPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { churches, setChurches } = useChurchStore()

  useEffect(() => {
    fetchChurches()
  }, [])

  const fetchChurches = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await churchService.getChurches()
      setChurches(data.items || [])
    } catch (err) {
      setError('Failed to load churches. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredChurches = churches.filter(
    (church) =>
      church.church_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="page-container">
      <section className="px-6 py-12 max-w-4xl mx-auto">
        <h1 className="font-display font-bold text-4xl md:text-5xl mb-8 text-faith-navy-900">
          Explore Churches
        </h1>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search churches by name"
            className="input-field"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading && <LoadingSkeletons count={3} />}

        {error && <Error message={error} onRetry={fetchChurches} />}

        {!isLoading && !error && filteredChurches.length === 0 && (
          <EmptyState message="No churches found matching your search." icon="⛪" />
        )}

        {!isLoading && !error && filteredChurches.length > 0 && (
          <div className="space-y-4">
            {filteredChurches.map((church) => (
              <ChurchCard key={church.id} church={church} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
