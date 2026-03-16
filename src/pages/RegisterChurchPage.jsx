import { useState } from 'react'
import { registerChurch } from '../services/api'

const DENOMINATIONS = ['Catholic','Protestant','Pentecostal','Baptist','Methodist','Anglican','Orthodox','Other']

const INITIAL = {
  name: '', denomination: '', address: '', city: 'Bangalore', area: '',
  contact_name: '', phone: '', email: '', website: '', description: '',
  timing_morning: false, timing_evening: false, timing_night: false,
  latitude: '', longitude: ''
}

export default function RegisterChurchPage() {
  const [form, setForm] = useState(INITIAL)
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const payload = { ...form }
      if (payload.latitude) payload.latitude = parseFloat(payload.latitude)
      else delete payload.latitude
      if (payload.longitude) payload.longitude = parseFloat(payload.longitude)
      else delete payload.longitude
      await registerChurch(payload)
      setStatus('success')
      setForm(INITIAL)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err?.response?.data?.detail || 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') return (
    <div className="page-container max-w-lg mx-auto text-center py-20">
      <div className="text-5xl mb-4">✅</div>
      <h2 className="font-display text-2xl text-slate-900 mb-2">Submitted for Review!</h2>
      <p className="text-slate-500 mb-6">Thank you! Your church has been submitted. Our team will review and get in touch via the contact details you provided.</p>
      <button className="btn-primary" onClick={() => setStatus('idle')}>Register Another Church</button>
    </div>
  )

  return (
    <div className="page-container max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-brand-900">Register Your Church</h1>
        <p className="text-slate-500 mt-2">Fill in the details below. After submission, our team will review and verify your listing.</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        {/* Church Name */}
        <div>
          <label className="label">Church Name <span className="text-red-500">*</span></label>
          <input name="name" required value={form.name} onChange={handleChange} className="input" placeholder="e.g. St. Thomas Church"/>
        </div>

        {/* Denomination */}
        <div>
          <label className="label">Denomination</label>
          <select name="denomination" value={form.denomination} onChange={handleChange} className="input">
            <option value="">Select denomination</option>
            {DENOMINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        {/* Area + City */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Area <span className="text-red-500">*</span></label>
            <input name="area" required value={form.area} onChange={handleChange} className="input" placeholder="e.g. Gottigere"/>
          </div>
          <div>
            <label className="label">City <span className="text-red-500">*</span></label>
            <input name="city" required value={form.city} onChange={handleChange} className="input"/>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="label">Full Address</label>
          <input name="address" value={form.address} onChange={handleChange} className="input" placeholder="Street address"/>
        </div>

        {/* Service Timings */}
        <div>
          <label className="label">Service Timings</label>
          <div className="flex gap-6 mt-1">
            {[['timing_morning','🌅 Morning'],['timing_evening','🌆 Evening'],['timing_night','🌙 Night']].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" name={key} checked={form[key]} onChange={handleChange} className="w-4 h-4 accent-brand-600"/>
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="label">Description</label>
          <textarea name="description" rows={3} value={form.description} onChange={handleChange} className="input resize-none" placeholder="Brief description of your church…"/>
        </div>

        {/* Website */}
        <div>
          <label className="label">Website</label>
          <input name="website" value={form.website} onChange={handleChange} className="input" placeholder="https://yourchurch.com"/>
        </div>

        <hr className="border-slate-200"/>
        <p className="text-sm font-bold text-slate-600 uppercase tracking-wide">Contact Person</p>

        <div>
          <label className="label">Contact Name <span className="text-red-500">*</span></label>
          <input name="contact_name" required value={form.contact_name} onChange={handleChange} className="input" placeholder="Full name"/>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Phone <span className="text-red-500">*</span></label>
            <input name="phone" type="tel" required value={form.phone} onChange={handleChange} className="input" placeholder="+91 9XXXXXXXXX"/>
          </div>
          <div>
            <label className="label">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="input" placeholder="church@example.com"/>
          </div>
        </div>

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">{errorMsg}</div>
        )}

        <button type="submit" disabled={status === 'loading'} className="btn-primary w-full justify-center">
          {status === 'loading' ? 'Submitting…' : 'Submit for Review'}
        </button>
      </form>
    </div>
  )
}
