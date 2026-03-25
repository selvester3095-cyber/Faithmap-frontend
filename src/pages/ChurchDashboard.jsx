import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyChurch, getMyEvents, addEvent, deleteEvent, changePassword } from '../services/api'
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
  const [activeTab, setActiveTab] = useState('events')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_EVENT)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', confirm_password: '' })
  const [pwStatus, setPwStatus] = useState('idle')

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

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (pwForm.new_password !== pwForm.confirm_password) {
      showMsg('error', 'New passwords do not match.')
      return
    }
    if (pwForm.new_password.length < 6) {
      showMsg('error', 'Password must be at least 6 characters.')
      return
    }
    setPwStatus('loading')
    try {
      await changePassword(token, {
        current_password: pwForm.current_password,
        new_password: pwForm.new_password
      })
      showMsg('success', 'Password changed successfully!')
      setPwForm({ current_password: '', new_password: '', confirm_password: '' })
      setPwStatus('idle')
    } catch (err) {
      showMsg('error', err?.response?.data?.detail || 'Failed to change password.')
      setPwStatus('idle')
    }
  }

  const formatDate = (ts) => {
    if (!ts) return ''
    return new Date(ts).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
  }

  if (loading) return <LoadingSpinner message="Loading your portal…"/>

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Portal Header */}
      <div className="bg-gradient-to-r from-brand-900 to-brand-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-brand-200 text-sm font-medium mb-1">Church Portal</p>
              <h1 className="font-display text-3xl">{church?.name}</h1>
              <p className="text-brand-200 mt-1">{church?.area}, {church?.city}</p>
              {church?.denomination && <p className="text-brand-200 text-sm mt-1">{church?.denomination}</p>}
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                ✓ Verified
              </span>
              <p className="text-brand-300 text-xs">{events.length} event{events.length !== 1 ? 's' : ''} published</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 mt-6">
            {['events', 'profile', 'settings'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-brand-700'
                    : 'text-brand-200 hover:text-white hover:bg-brand-800'
                }`}>
                {tab === 'events' && '📅 '}
                {tab === 'profile' && '⛪ '}
                {tab === 'settings' && '⚙️ '}
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {message && (
          <div className={`text-sm rounded-lg px-4 py-3 mb-6 ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}>
            {message.text}
          </div>
        )}

        {/* ── EVENTS TAB ── */}
        {activeTab === 'events' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl text-slate-800">Your Events</h2>
              <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                {showForm ? '✕ Cancel' : '+ Add Event'}
              </button>
            </div>

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
                  <input name="notes" value={form.notes} onChange={handleChange} className="input" placeholder="Any additional info…"/>
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" name="refreshment
