import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getChurches } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const DENOMINATIONS = ['All','Catholic','Protestant','Pentecostal','Baptist','Methodist','Anglican','Orthodox','Other']
const TIMINGS = [{ value: '', label: 'Any Time' },{ value: 'morning', label: '🌅 Morning' },{ value: 'evening', label: '🌆 Evening' },{ value: 'night', label: '🌙 Night' }]

export default function HomePage() {
  const navigate = useNavigate()
  const [churches, setChurches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [denomination, setDenomination] = useState('All')
  const [timing, setTiming] = useState('')

  useEffect(() => {
    const params = {}
    if (denomination !== 'All') params.denomination = denomination
    if (timing) params.timing = timing
    getChurches(params)
      .then(res => setChurches(res.data))
      .catch(() => setError('Failed to load churches.'))
      .finally(() => setLoading(false))
  }, [denomination, timing])

  const filtered = churches.filter(c =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.area?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-container">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl sm:text-5xl text-brand-900 mb-3">Find a Church Near You</h1>
        <p className="text-slate-500 text-lg">Serving the community of Gottigere, Bangalore</p>
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
              placeholder="Search by name or area…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input pl-9"
            />
          </div>
          <select value={denomination} onChange={e => setDenomination(e.target.value)} className="input sm:w-52">
            {DENOMINATIONS.map(d => <option key={d} value={d}>{d === 'All' ? 'All Denominations' : d}</option>)}
          </select>
          <select value={timing} onChange={e => setTiming(e.target.value)} className="input sm:w-40">
            {TIMINGS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
      </div>

      {/* Results */}
      {loading && <LoadingSpinner message="Finding churches…" />}
      {error && <div className="text-center py-12 text-red-500">{error}</div>}

      {!loading && !error && (
        <>
          <p className="text-sm text-slate-500 mb-4">{filtered.length} church{filtered.length !== 1 ? 'es' : ''} found</p>
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-5xl mb-4">⛪</p>
              <p className="text-lg font-medium">No churches found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(church => (
                <div key={church.id} className="card p-5 cursor-pointer" onClick={() => navigate(`/churches/${church.id}`)}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg text-slate-900">{church.name}</h3>
                      <p className="text-sm text-slate-500 mt-0.5">{church.area}, {church.city}</p>
                      {church.denomination && <p className="text-xs text-brand-600 font-semibold mt-1">{church.denomination}</p>}
                    </div>
                    {church.status === 'verified' && (
                      <span className="verified-badge shrink-0">✓ Verified</span>
                    )}
                  </div>
                  {church.description && (
                    <p className="text-sm text-slate-500 mt-3 line-clamp-2">{church.description}</p>
                  )}
                  <div className="mt-3 flex gap-2 text-xs text-slate-400">
                    {church.timing_morning && <span>🌅 Morning</span>}
                    {church.timing_evening && <span>🌆 Evening</span>}
                    {church.timing_night && <span>🌙 Night</span>}
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-brand-600 text-sm font-medium">
                    View details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
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
