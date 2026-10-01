import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { eventService } from '@/api/events'
import { EventCard } from '@/components/EventCard'
import { LoadingSkeletons } from '@/components/Loading'
import { EmptyState, Error } from '@/components/Error'
import { useEventStore } from '@/store/useEventStore'
import { useGeolocation } from '@/hooks/useGeolocation'

const CATEGORIES = [
  'Worship',
  'Prayer',
  'Fasting Prayer',
  'Youth Meeting',
  'Bible Study',
  'Healing Service',
]

export const HomePage = () => {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'nearest' | 'soonest'>('soonest')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { events, setEvents } = useEventStore()
  const { requestLocation } = useGeolocation()

  useEffect(() => {
    fetchEvents()
  }, [selectedCategory, date])

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await eventService.getEvents({
        category: selectedCategory || undefined,
        start_date: date || undefined,
      })
      setEvents(data.items || [])
    } catch (err) {
      setError('Failed to load events. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUseLocation = async () => {
    const userLocation = await requestLocation()
    if (userLocation) {
      // Here you would typically geocode the coordinates to get a location string
      setLocation(`${userLocation.latitude.toFixed(2)}, ${userLocation.longitude.toFixed(2)}`)
    }
  }

  const handleQuickFilter = (newDate: string) => {
    setDate(newDate)
  }

  const filteredEvents = events.sort((a, b) => {
    if (sortBy === 'nearest') {
      const distA = parseFloat(a.distance || '999')
      const distB = parseFloat(b.distance || '999')
      return distA - distB
    }
    return new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  })

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-faith-blue-50 to-white pt-12 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-6 text-faith-navy-900 text-wrap-balance">
            Find a Place to Worship.
            <br />
            Find a Community.
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl">
            Discover nearby churches, worship services, and Christian gatherings in your area. Connect with
            faith-filled communities today.
          </p>

          {/* Search Section */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search location or postcode"
                className="input-field flex-1"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <input
                type="date"
                className="input-field md:w-48"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <button onClick={handleUseLocation} className="btn-primary whitespace-nowrap">
                📍 Use My Location
              </button>
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleQuickFilter(new Date().toISOString().split('T')[0])}
                className="chip"
              >
                Today
              </button>
              <button
                onClick={() => {
                  const tomorrow = new Date()
                  tomorrow.setDate(tomorrow.getDate() + 1)
                  handleQuickFilter(tomorrow.toISOString().split('T')[0])
                }}
                className="chip"
              >
                Tomorrow
              </button>
              <button onClick={() => setDate('')} className="chip">
                All Upcoming
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Event Discovery */}
      <section className="px-6 py-12 max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="font-display font-bold text-2xl mb-6 text-faith-navy-900">Event Categories</h2>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              >
                <span>✓</span>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-xl text-faith-navy-900">
              {events.length} Events Found
            </h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'nearest' | 'soonest')}
              className="input-field w-auto"
            >
              <option value="soonest">Soonest</option>
              <option value="nearest">Nearest</option>
            </select>
          </div>

          {isLoading && <LoadingSkeletons count={3} />}

          {error && <Error message={error} onRetry={fetchEvents} />}

          {!isLoading && !error && filteredEvents.length === 0 && (
            <EmptyState message="No events found matching your filters. Try adjusting your search." icon="📅" />
          )}

          {!isLoading && !error && filteredEvents.length > 0 && (
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => navigate(`/events/${event.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
