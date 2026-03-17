import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyChurch, getMyEvents, addEvent, deleteEvent } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const EMPTY_EVENT = {
  title: '', description: '', start_ts: '', end_ts: '',
  venue: '', refreshments: false, notes: '', published: true
}

export default function ChurchDashboard() {
  const navigate = useNavigate()
  const token = localStorage.getItem('churchToken')
  const [church, setChurch] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_EVENT)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (!token) { navigate('/church'); return }
    Promise.all([getMyChurch(token), getMyEvents(token)])
      .then(([churchRes, eventsRes]) => {
        setChurch(churchRes.data)
        setEvents(eventsRes.data)
      })
      .catch(() => navigate('/church'))
      .finally(() => setLoading(false))
  }, [])

  const showMsg = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleAddEvent = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form }
      if (!payload.start_ts) delete payload.start_ts
      if (!payload.end_ts) delete payload.end_ts
      const res = await addEvent(token, payload)
      setEvents(prev => [res.data, ...prev])
      setForm(EMPTY_EVENT)
      setShowForm(false)
      showMsg('success', 'Event added successfully!')
    } catch {
      showMsg('error', 'Failed to add event.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (event) => {
    if (!confirm(`Delete "${event.title}"?`)) return
    try {
      await deleteEvent(token, event.id)
      setEvents(prev => prev.filter(e => e.id !== event.id))
      showMsg('success', 'Event deleted.')
    } catch {
      showMsg('error', 'Failed to delete event.')
    }
  }

  if (loading) return <LoadingSpinner message="Loading your portal…"/>

  return (
    <div className="page-container">
      {/* Church Header */}
      {church && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-3xl text-slate-900">{church.name}</h1>
              <p className="text-slate-500 mt-1">{church.area}, {church.city}</p>
              {church.denomination && <p className="text-sm text-brand-600 font-semibold mt-1">{church.denomination}</p>}
            </div>
            <span className="verified-badge">✓ Verified</span>
          </div>
          {church.description && <p className="text-sm text-slate-600 mt-3">{church.description}</p>}
        </div>
      )}

      {message && (
        <div className={`text-sm rounded-lg px-4 py-3 mb-6 ${message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-600'}`}>
          {message.text}
        </div>
      )}

      {/* Events Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl text-slate-800">Your Events</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
          {showForm ? '✕ Cancel' : '+ Add Event'}
        </button>
      </div>

      {/* Add Event Form */}
      {showForm && (
        <form onSubmit={handleAddEvent} className="card p-6 mb-6 space-y-4">
          <h3 className="font-semibold text-slate-800">New Event</h3>
          <div>
            <label className="label">Event Title <span className="text-red-500">*</span></label>
            <input name="title" required value={form.title} onChange={handleChange} className="input" placeholder="e.g. Sunday Service"/>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea name="description" rows={2} value={form.description} onChange={handleChange} className="input resize-none" placeholder="Brief description…"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Start Date & Time</label>
              <input name="start_ts" type="datetime-local" value={form.start_ts} onChange={handleChange} className="input"/>
            </div>
            <div>
              <label className="label">End Date & Time</label>
              <input name="end_ts" type="datetime-local" value={form.end_ts} onChange={handleChange} className="input"/>
            </div>
          </div>
          <div>
            <label className="label">Venue</label>
            <input name="venue" value={form.venue} onChange={handleChange} className="input" placeholder="e.g. Main Hall"/>
          </div>
          <div>
            <label className="label">Notes</label>
            <input name="notes" value={form.notes} onChange={handleChange} className="input" placeholder="Any additional notes…"/>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" name="refreshments" checked={form.refreshments} onChange={handleChange} className="w-4 h-4 accent-brand-600"/>
              🍽 Refreshments available
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" name="published" checked={form.published} onChange={handleChange} className="w-4 h-4 accent-brand-600"/>
              Publish immediately
            </label>
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full justify-center">
            {saving ? 'Saving…' : 'Add Event'}
          </button>
        </form>
      )}

      {/* Events List */}
      {events.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-5xl mb-4">📅</p>
          <p className="text-lg font-medium">No events yet</p>
          <p className="text-sm mt-1">Click "Add Event" to create your first event</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{event.title}</h3>
                    {!event.published && <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full">Draft</span>}
                  </div>
                  {event.description && <p className="text-sm text-slate-600 mt-1">{event.description}</p>}
                  <div className="mt-2 text-xs text-slate-500 space-y-1">
                    {event.start_ts && <p>🗓 {new Date(event.start_ts).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>}
                    {event.venue && <p>📍 {event.venue}</p>}
                    {event.refreshments && <p>🍽 Refreshments</p>}
                    {event.interest_count > 0 && <p>👥 {event.interest_count} interested</p>}
                  </div>
                </div>
                <button onClick={() => handleDelete(event)} className="text-red-400 hover:text-red-600 text-sm font-medium shrink-0">
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
