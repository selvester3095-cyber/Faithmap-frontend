import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllEvents } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const DENOMINATIONS = ['All','Catholic','Protestant','Pentecostal','Baptist','Methodist','Anglican','Orthodox','CSI','CNI','Other']

export default function HomePage() {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [denomination, setDenomination] = useState('All')
  const [userLocation, setUserLocation] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)

  const fetchEvents = (lat, lng) => {
    setLoading(true)
    const params = {}
    if (denomination !== 'All') params.denomination = denomination
    if (lat && lng) { params.lat = lat; params.lng = lng }
    getAllEvents(params)
      .then(res => setEvents(res.data))
      .catch(() => setError('Failed to load events.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchEvents(userLocation?.lat, userLocation?.lng)
  }, [denomination, userLocation])

  const detectLocation = () => {
    if (!navigator.geolocation) return
    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocationLoading(false)
      },
      () => setLocationLoading(false),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const filtered = events.filter(e =>
    !search ||
    e.title?.toLowerCase().includes(search.toLowerCase()) ||
    e.church_name?.toLowerCase().includes(search.toLowerCase()) ||
    e.church_area?.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (ts) => {
    if (!ts) return ''
    return new Date(ts).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
  }

  return (
    <div className="page-container">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl sm:text-5xl text-brand-900 mb-3">
          Find Church Events Near You
        </h1>
        <p className="text-slate-500 text-lg">Gottigere & surrounding areas, Bangalore</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              placeholder="Search events or churches…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input pl-9"
            />
          </div>
          <select value={denomination} onChange={e => setDenomination(e.target.value)} className="input sm:w-48">
            {DENOMINATIONS.map(d => <option key={d} value={d}>{d === 'All' ? 'All Denominations' : d}</option>)}
          </select>
          <button
            onClick={detectLocation}
            disabled={locationLoading}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors flex items-center gap-2 ${
              userLocation
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-white border-slate-300 text-slate-600 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-600'
            }`}
          >
            {locationLoading ? '⏳' : userLocation ? '📍 Nearby' : '📍 Near Me'}
          </button>
          {userLocation && (
            <button onClick={() => setUserLocation(null)} className="text-sm text-slate-400 hover:text-red-500 px-2">✕</button>
          )}
        </div>
      </div>

      {loading && <LoadingSpinner message="Finding events…"/>}
      {error && <div className="text-center py-12 text-red-500">{error}</div>}

      {!loading && !error && (
        <>
          <p className="text-sm text-slate-500 mb-4">
            {filtered.length} event{filtered.length !== 1 ? 's' : ''} found
            {userLocation ? ' · sorted by distance' : ''}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p className="text-5xl mb-4">📅</p>
              <p className="text-lg font-medium">No events found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(event => (
                <div key={event.id} className="card p-5 cursor-pointer flex flex-col"
                  onClick={() => navigate(`/churches/${event.church_id}`)}>

                  {/* Church name */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="text-xs text-brand-600 font-semibold">{event.church_name}</p>
                      <p className="text-xs text-slate-400">{event.church_area}, {event.church_city}</p>
                    </div>
                    {event.distance_km !== null && event.distance_km !== undefined && (
                      <span className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full border border-brand-200 shrink-0">
                        {event.distance_km} km
                      </span>
                    )}
                  </div>

                  {/* Event title */}
                  <h3 className="font-display text-lg text-slate-900 mb-2">{event.title}</h3>
                  {event.description && (
                    <p className="text-sm text-slate-500 mb-3 line-clamp-2">{event.description}</p>
                  )}

                  {/* Event details */}
                  <div className="mt-auto space-y-1 text-xs text-slate-500">
                    {event.start_ts && <p>🗓 {formatDate(event.start_ts)}</p>}
                    {event.venue && <p>📍 {event.venue}</p>}
                    {event.refreshments && <p>🍽 Refreshments available</p>}
                  </div>

                  {/* Footer */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {event.interest_count > 0 ? `${event.interest_count} interested` : ''}
                    </span>
                    <span className="text-xs text-brand-600 font-medium">View details →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
