import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { eventService } from '@/api/events'
import type { Event } from '@/types'
import { formatDate, formatTime } from '@/utils/formatters'
import { LoadingSpinner } from '@/components/Loading'
import { Error } from '@/components/Error'
import { ChevronLeft } from 'lucide-react'

export const EventDetailPage = () => {
  const { eventId } = useParams<{ eventId: string }>()
  const navigate = useNavigate()
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!eventId) return
    fetchEvent()
  }, [eventId])

  const fetchEvent = async () => {
    try {
      setIsLoading(true)
      setError(null)
      if (!eventId) return
      const data = await eventService.getEventById(Number(eventId))
      setEvent(data)
    } catch (err) {
      setError('Failed to load event details.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error || !event) {
    return <Error message={error || 'Event not found'} onRetry={fetchEvent} />
  }

  return (
    <div className="page-container">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-faith-green-400 hover:text-faith-green-600 font-semibold flex items-center gap-2"
        >
          <ChevronLeft size={20} />
          Back to Events
        </button>

        <div className="card mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="font-display font-bold text-3xl mb-2 text-faith-navy-900">{event.title}</h1>
              <p className="text-lg text-gray-600">{event.church}</p>
            </div>
            {event.verified && <span className="badge verified">✓ Verified</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 py-6 border-t border-b border-gray-200">
            <div className="space-y-2">
              <span className="text-gray-500 text-sm">Date</span>
              <p className="font-display font-bold text-xl text-faith-navy-900">
                {formatDate(event.start_time)}
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-gray-500 text-sm">Time</span>
              <p className="font-display font-bold text-xl text-faith-navy-900">
                {formatTime(event.start_time)} - {formatTime(event.end_time)}
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-gray-500 text-sm">Location</span>
              <p className="font-semibold text-lg text-faith-navy-900">{event.location}</p>
              {event.distance && <p className="text-gray-600">{event.distance} away</p>}
            </div>
            <div className="space-y-2">
              <span className="text-gray-500 text-sm">Attending</span>
              <p className="font-display font-bold text-xl text-faith-navy-900">
                {event.interested_count} people
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-display font-bold text-lg mb-3 text-faith-navy-900">About this event</h3>
            <p className="text-gray-700 leading-relaxed mb-4">{event.description}</p>

            <div className="flex gap-2 flex-wrap">
              <span className="badge">{event.category}</span>
              {event.language && <span className="badge">{event.language}</span>}
            </div>
          </div>

          <div className="flex gap-3 flex-col md:flex-row">
            <button className="btn-primary flex-1">
              🗺️ Get Directions
            </button>
            <button className="btn-secondary flex-1">
              📤 Share Event
            </button>
            <button className="btn-secondary flex-1">
              💾 Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
