import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSubmittedChurches, verifyChurch, rejectChurch, reviewChurch, resubmitChurch, deleteChurch } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const TABS = ['submitted', 'reviewing', 'verified', 'rejected']

export default function AdminDashboard() {
  const navigate = useNavigate()
  const token = localStorage.getItem('adminToken')
  const [tab, setTab] = useState('submitted')
  const [churches, setChurches] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedChurch, setSelectedChurch] = useState(null)

  useEffect(() => {
    if (!token) { navigate('/admin'); return }
    fetchChurches()
  }, [tab, search])

  const fetchChurches = () => {
    setLoading(true)
    getSubmittedChurches(token, tab, search)
      .then(res => setChurches(res.data))
      .catch(() => navigate('/admin'))
      .finally(() => setLoading(false))
  }

  const showMsg = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  const handleVerify = async (church) => {
    if (!confirm(`Verify "${church.name}"? This will make it live on faithmap.in`)) return
    try {
      const res = await verifyChurch(token, church.id)
      const data = res.data
      showMsg('success',
        `"${church.name}" is now LIVE! 🎉 Portal login: ${data.portal_email || church.email} / ${data.portal_password || church.phone}`
      )
      setSelectedChurch(null)
      fetchChurches()
    } catch {
      showMsg('error', 'Verification failed.')
    }
  }

  const handleReject = async (church) => {
    if (!confirm(`Reject "${church.name}"?`)) return
    try {
      await rejectChurch(token, church.id)
      showMsg('success', `"${church.name}" rejected.`)
      setSelectedChurch(null)
      fetchChurches()
    } catch {
      showMsg('error', 'Failed to reject.')
    }
  }

  const handleReview = async (church) => {
    try {
      await reviewChurch(token, church.id)
      showMsg('success', `"${church.name}" moved to reviewing.`)
      setSelectedChurch(null)
      fetchChurches()
    } catch {
      showMsg('error', 'Failed.')
    }
  }

  const handleResubmit = async (church) => {
    try {
      await resubmitChurch(token, church.id)
      showMsg('success', `"${church.name}" moved back to submitted.`)
      setSelectedChurch(null)
      fetchChurches()
    } catch {
      showMsg('error', 'Failed.')
    }
  }

  const handleDelete = async (church) => {
    if (!confirm(`Permanently delete "${church.name}"?`)) return
    try {
      await deleteChurch(token, church.id)
      showMsg('success', `"${church.name}" deleted.`)
      setSelectedChurch(null)
      fetchChurches()
    } catch {
      showMsg('error', 'Failed to delete.')
    }
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Manage all church submissions</p>
        </div>
        <button className="btn-secondary text-sm" onClick={fetchChurches}>↻ Refresh</button>
      </div>

      {message && (
        <div className={`text-sm rounded-lg px-4 py-3 mb-6 ${
          message.type === 'success'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {TABS.map(t => (
          <button key={t} onClick={() => { setTab(t); setSelectedChurch(null) }}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              tab === t ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          type="text"
          placeholder="Search by name, area or city…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input pl-9"
        />
      </div>

      {loading && <LoadingSpinner message="Loading churches…"/>}

      {!loading && churches.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-lg font-medium">No {tab} churches</p>
        </div>
      )}

      {!loading && churches.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Church List */}
          <div className="space-y-3">
            <p className="text-sm text-slate-500">{churches.length} church{churches.length !== 1 ? 'es' : ''}</p>
            {churches.map(church => (
              <div
                key={church.id}
                onClick={() => setSelectedChurch(church)}
                className={`card p-4 cursor-pointer transition-all ${
                  selectedChurch?.id === church.id
                    ? 'border-brand-500 shadow-md'
                    : 'hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-lg text-slate-900">{church.name}</h3>
                    <p className="text-sm text-slate-500">{church.area}, {church.city}</p>
                    <p className="text-xs text-brand-600 font-medium mt-1">{church.denomination}</p>
                  </div>
                  <svg className="w-5 h-5 text-slate-300 mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Submitted: {new Date(church.created_at).toLocaleDateString('en-IN')}
                </p>
              </div>
            ))}
          </div>

          {/* Church Detail Panel */}
          {selectedChurch ? (
            <div className="card p-6 h-fit sticky top-20">
              <div className="flex items-start justify-between mb-4">
                <h2 className="font-display text-2xl text-slate-900">{selectedChurch.name}</h2>
                <button onClick={() => setSelectedChurch(null)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
              </div>

              <div className="space-y-3 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Area</p>
                    <p className="text-sm text-slate-700 font-medium">{selectedChurch.area}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">City</p>
                    <p className="text-sm text-slate-700 font-medium">{selectedChurch.city}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Denomination</p>
                    <p className="text-sm text-slate-700 font-medium">{selectedChurch.denomination || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Status</p>
                    <p className="text-sm text-slate-700 font-medium capitalize">{selectedChurch.status}</p>
                  </div>
                </div>

                <hr className="border-slate-100"/>

                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Contact Person</p>
                  <p className="text-sm text-slate-700 font-medium">{selectedChurch.contact_name}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {selectedChurch.phone && (
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Phone</p>
                      <a href={`tel:${selectedChurch.phone}`} className="text-sm text-brand-600">{selectedChurch.phone}</a>
                    </div>
                  )}
                  {selectedChurch.email && (
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Email</p>
                      <a href={`mailto:${selectedChurch.email}`} className="text-sm text-brand-600 break-all">{selectedChurch.email}</a>
                    </div>
                  )}
                </div>

                {selectedChurch.website && (
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Website</p>
                    <a href={selectedChurch.website} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-600">{selectedChurch.website}</a>
                  </div>
                )}

                {selectedChurch.description && (
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Notes</p>
                    <p className="text-sm text-slate-600">{selectedChurch.description}</p>
                  </div>
                )}

                {selectedChurch.latitude && selectedChurch.longitude && (
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Location</p>
                    
                      href={`https://www.google.com/maps?q=${selectedChurch.latitude},${selectedChurch.longitude}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-brand-600 font-medium hover:underline"
                    >
                      📍 View on Google Maps
                    </a>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {(tab === 'submitted' || tab === 'reviewing') && (
                  <>
                    <button onClick={() => handleVerify(selectedChurch)} className="btn-primary w-full justify-center">
                      ✓ Verify & Make Live
                    </button>
                    <button onClick={() => handleReject(selectedChurch)} className="btn-danger w-full justify-center">
                      ✗ Reject
                    </button>
                    {tab === 'submitted' && (
                      <button onClick={() => handleReview(selectedChurch)} className="btn-secondary w-full justify-center">
                        Move to Reviewing
                      </button>
                    )}
                  </>
                )}
                {tab === 'verified' && (
                  <button onClick={() => handleDelete(selectedChurch)} className="btn-danger w-full justify-center">
                    🗑 Delete Church
                  </button>
                )}
                {tab === 'rejected' && (
                  <>
                    <button onClick={() => handleResubmit(selectedChurch)} className="btn-primary w-full justify-center">
                      ↩ Move Back to Submitted
                    </button>
                    <button onClick={() => handleReview(selectedChurch)} className="btn-secondary w-full justify-center">
                      Move to Reviewing
                    </button>
                    <button onClick={() => handleDelete(selectedChurch)} className="btn-danger w-full justify-center">
                      🗑 Delete Church
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex items-center justify-center h-64 text-slate-300 border-2 border-dashed border-slate-200 rounded-xl">
              <div className="text-center">
                <p className="text-4xl mb-2">👆</p>
                <p className="text-sm">Click a church to see full details</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
