import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getChurchById, markInterest } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function ChurchDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [church, setChurch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [interested, setInterested] = useState({})

  useEffect(() => {
    getChurchById(id)
      .then(res => setChurch(res.data))
      .catch(() => setError('Church not found.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleInterest = async (eventId) => {
    try {
      await markInterest(eventId)
      setInterested(prev => ({ ...prev, [eventId]: true }))
    } catch {}
  }

  if (loading) return <LoadingSpinner message="Loading church details…" />
  if (error) return (
    <div className="page-container text-center py-20">
      <p className="text-red-500 mb-4">{error}</p>
      <button className="btn-secondary" onClick={() => navigate('/')}>Back to Home</button>
    </div>
  )

  const mapsUrl = church.latitude && church.longitude
    ? `https://www.google.com/maps?q=${church.latitude},${church.longitude}`
    : church.address ? `https://www.google.com/maps/search/${encodeURIComponent(church.address)}` : null

  return (
    <div className="page-container max-w-3xl mx-auto">
      <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600 mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
        Back to search
      </button>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-3xl text-slate-900">{church.name}</h1>
          <p className="text-slate-500 mt-1">{church.area}, {church.city}</p>
          {church.denomination && <p className="text-sm text-brand-600 font-semibold mt-1">{church.denomination}</p>}
          <div className="flex gap-2 mt-2 text-sm text-slate-400">
            {church.timing_morning && <span>🌅 Morning</span>}
            {church.timing_evening && <span>🌆 Evening</span>}
            {church.timing_night && <span>🌙 Night</span>}
          </div>
        </div>
        {church.status === 'verified' && <span className="verified-badge">✓ Verified</span>}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="card p-5">
          <h2 className="font-display text-lg mb-4 text-slate-800">About</h2>
          {church.description && <p className="text-sm text-slate-600 mb-4">{church.description}</p>}
          {church.address && (
            <div className="mb-3">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Address</p>
              <p className="text-sm text-slate-700">{church.address}</p>
            </div>
          )}
          {mapsUrl && (
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-brand-600 font-semibold hover:underline">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Open in Google Maps
            </a>
          )}
        </div>

        <div className="card p-5">
          <h2 className="font-display text-lg mb-4 text-slate-800">Contact</h2>
          {church.contact_name && (
            <div className="mb-3">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Contact Person</p>
              <p className="text-sm text-slate-700">{church.contact_name}</p>
            </div>
          )}
          {church.phone && (
            <div className="mb-3">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Phone</p>
              <a href={`tel:${church.phone}`} className="text-sm text-brand-600 hover:underline">{church.phone}</a>
            </div>
          )}
          {church.email && (
            <div className="mb-3">
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Email</p>
              <a href={`mailto:${church.email}`} className="text-sm text-brand-600 hover:underline">{church.email}</a>
            </div>
          )}
          {church.website && (
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Website</p>
              <a href={church.website} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-600 hover:underline break-all">{church.website}</a>
            </div>
          )}
        </div>
      </div>

      {/* Events */}
      {church.events && church.events.length > 0 && (
        <div>
          <h2 className="font-display text-2xl text-slate-800 mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {church.events.map(event => (
              <div key={event.id} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{event.title}</h3>
