import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { churchLogin } from '../services/api'

export default function ChurchLoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-100 rounded-2xl mb-4">
            <span style={{fontSize: '28px'}}>⛪</span>
          </div>
          <h1 className="font-display text-3xl text-brand-900">Church Portal</h1>
          <p className="text-slate-500 mt-2">Manage your church and events</p>
        </div>

        {/* Login Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="input"
                placeholder="Your registered church email"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} required
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="input pr-12"
                  placeholder="Your phone number (default)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Default password is your registered phone number
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3"
            >
              {loading ? 'Logging in…' : 'Login to Portal'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-center text-sm text-slate-400">
              Your church must be verified by admin first
            </p>
            <p className="text-center text-sm text-slate-400 mt-1">
              Need help? Contact{' '}
              <a href="mailto:selvestersolmon@gmail.com" className="text-brand-600 hover:underline">
                selvestersolmon@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-slate-400 mt-6">
          Not registered yet?{' '}
          <a href="/register" className="text-brand-600 hover:underline font-medium">
            Register your church
          </a>
        </p>
      </div>
    </div>
  )
}
