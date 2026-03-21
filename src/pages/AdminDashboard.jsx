import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSubmittedChurches, verifyChurch, rejectChurch, deleteChurch } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const TABS = ['submitted', 'reviewing', 'verified', 'rejected']

export default function AdminDashboard() {
  const navigate = useNavigate()
  const token = localStorage.getItem('adminToken')
  const [tab, setTab] = useState('submitted')
  const [churches, setChurches] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [verifyModal, setVerifyModal] = useState(null)
  const [verifyForm, setVerifyForm] = useState({ email: '', password: '' })

  useEffect(() => {
    if (!token) { navigate('/admin'); return }
    fetchChurches()
  }, [tab])

  const fetchChurches = () => {
    setLoading(true)
    getSubmittedChurches(token, tab)
      .then(res => setChurches(res.data))
      .catch(() => navigate('/admin'))
      .finally(() => setLoading(false))
  }

  const showMsg = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleVerify = async (church) => {
  try {
    await verifyChurch(token, church.id)
    showMsg('success', `"${church.name}" is now verified and live!`)
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
      fetchChurches()
    } catch {
      showMsg('error', 'Failed to reject.')
    }
  }

  const handleDelete = async (church) => {
    if (!confirm(`Permanently delete "${church.name}"?`)) return
    try {
      await deleteChurch(token, church.id)
      showMsg('success', `"${church.name}" deleted.`)
      fetchChurches()
    } catch {
      showMsg('error', 'Failed to delete.')
    }
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Manage all church submissions</p>
        </div>
        <button className="btn-secondary text-sm" onClick={fetchChurches}>↻ Refresh</button>
      </div>

      {message && (
        <div className={`text-sm rounded-lg px-4 py-3 mb-6 ${message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-600'}`}>
          {message.text}
        </div>
      )}

      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {t}
          </button>
        ))}
      </div>

      {loading && <LoadingSpinner message="Loading churches…"/>}

      {!loading && churches.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-lg font-medium">No {tab} churches</p>
        </div>
      )}

      {!loading && churches.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">{churches.length} church{churches.length !== 1 ? 'es' : ''}</p>
          {churches.map(church => (
            <div key={church.id} className="card p-5">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <h3 className="font-display text-xl text-slate-900">{church.name}</h3>
                  <p className="text-sm text-slate-500">{church.area}, {church.city} · {church.denomination || 'No denomination'}</p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-3 text-sm">
                    {church.contact_name && <div><span className="text-xs text-slate-400 uppercase">Contact</span><p className="text-slate-700">{church.contact_name}</p></div>}
                    {church.phone && <div><span className="text-xs text-slate-400 uppercase">Phone</span><p className="text-slate-700">{church.phone}</p></div>}
                    {church.email && <div><span className="text-xs text-slate-400 uppercase">Email</span><p className="text-slate-700">{church.email}</p></div>}
                    {church.address && <div><span className="text-xs text-slate-400 uppercase">Address</span><p className="text-slate-700">{church.address}</p></div>}
                  </div>
                  {church.description && <p className="text-sm text-slate-500 mt-2 italic">{church.description}</p>}
                  <p className="text-xs text-slate-400 mt-2">Submitted: {new Date(church.created_at).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                  {(tab === 'submitted' || tab === 'reviewing') && (
                    <button onClick={() => setVerifyModal(church)} className="btn-primary text-sm">✓ Verify</button>
                  )}
                  {tab === 'submitted' && (
                    <button onClick={() => handleReject(church)} className="btn-danger text-sm">✗ Reject</button>
                  )}
                  {(tab === 'verified' || tab === 'rejected') && (
                    <button onClick={() => handleDelete(church)} className="btn-danger text-sm">🗑 Delete</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {verifyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="font-display text-xl mb-1">Verify Church</h2>
            <p className="text-sm text-slate-500 mb-4">Create login for <strong>{verifyModal.name}</strong></p>
            <div className="space-y-4">
              <div>
                <label className="label">Church Portal Email</label>
                <input type="email" value={verifyForm.email} onChange={e => setVerifyForm(p => ({ ...p, email: e.target.value }))} className="input" placeholder="pastor@church.com"/>
              </div>
              <div>
                <label className="label">Temporary Password</label>
                <input type="text" value={verifyForm.password} onChange={e => setVerifyForm(p => ({ ...p, password: e.target.value }))} className="input" placeholder="Set a temporary password"/>
              </div>
              <p className="text-xs text-slate-400">Share these credentials with the church to access their portal.</p>
              <div className="flex gap-3">
                <button onClick={handleVerify} className="btn-primary flex-1">Verify & Create Login</button>
                <button onClick={() => setVerifyModal(null)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
