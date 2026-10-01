import { Link } from 'react-router-dom'
import type { Event } from '@/types'
import { formatDate, formatTime } from '@/utils/formatters'

interface EventCardProps {
  event: Event
  onClick?: () => void
}

export const EventCard = ({ event, onClick }: EventCardProps) => {
  return (
    <div className="event-card" onClick={onClick}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-display font-bold text-lg text-faith-navy-900 mb-1">{event.title}</h3>
          <p className="text-gray-600 text-sm">{event.church}</p>
        </div>
        {event.verified && (
          <span className="badge verified">✓ Verified</span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-500 text-xs">Date</span>
          <p className="font-semibold text-faith-navy-900">{formatDate(event.start_time)}</p>
        </div>
        <div>
          <span className="text-gray-500 text-xs">Time</span>
          <p className="font-semibold text-faith-navy-900">{formatTime(event.start_time)}</p>
        </div>
        <div>
          <span className="text-gray-500 text-xs">Location</span>
          <p className="font-semibold text-faith-navy-900">{event.distance || 'N/A'}</p>
        </div>
        <div>
          <span className="text-gray-500 text-xs">Language</span>
          <p className="font-semibold text-faith-navy-900">{event.language || 'N/A'}</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <span className="badge">{event.category}</span>
        <span className="text-gray-500 text-xs">
          👥 {event.interested_count} attending
        </span>
      </div>
    </div>
  )
}
