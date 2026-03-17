import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { churchLogin } from '../services/api'

export default function ChurchLoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await churchLogin(form)
      localStorage.setItem('churchToken', res.data.access_token)
      navigate('/church/dashboard')
    } catch {
      setError('Invalid email or password. Contact admin if you need help.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl">⛪</span>
          <h1 className="font-display text-3xl text-brand-900 mt-2">Church Portal</h1>
          <p className="text-slate-500 mt-1">Login to manage your church</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email</label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="input"
                placeholder="pastor@church.com"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password" required
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="input"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Don't have access? Your church must be verified first.{' '}
            <a href="/register" className="text-brand-600 hover:underline">Register here</a>
          </p>
        </div>
      </div>
    </div>
  )
}
