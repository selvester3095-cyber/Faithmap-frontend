import { useState } from 'react'
import { registerChurch } from '../services/api'

const DENOMINATIONS = ['Catholic','Protestant','Pentecostal','Baptist','Methodist','Anglican','Orthodox','CSI','CNI','Other']

const INITIAL = {
  name: '', denomination: '', other_denomination: '',
  city: 'Bangalore', area: '',
  contact_name: '', phone: '', email: '',
  website: '', social_media: '',
  latitude: null, longitude: null,
  description: '',
}

export default function RegisterChurchPage() {
  const [form, setForm] = useState(INITIAL)
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [locationStatus, setLocationStatus] = useState('idle')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error')
      return
    }
    setLocationStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(prev => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        }))
        setLocationStatus('success')
      },
      () => setLocationStatus('error'),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.phone && !form.email) {
      setErrorMsg('Please provide at least a phone number or email.')
      setStatus('error')
      return
    }
    setStatus('loading')
    setErrorMsg('')
    try {
      const payload = {
        name: form.name,
        denomination: form.denomination === 'Other' ? form.other_denomination : form.denomination,
        city: form.city,
        area: form.area,
        contact_name: form.contact_name,
        phone: form.phone || null,
        email: form.email || null,
        website: form.website || null,
        description: form.social_media ? `Social: ${form.social_media}` : null,
        latitude: form.latitude,
        longitude: form.longitude,
      }
      await registerChurch(payload)
      setStatus('success')
      setForm(INITIAL)
      setLocationStatus('idle')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err?.response?.data?.detail || 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') return (
    <div className="page-container max-w-lg mx-auto text-center py-20">
      <div className="text-6xl mb-4">✅</div>
      <h2 className="font-display text-2xl text-slate-900 mb-2">Submitted for Review!</h2>
      <p className="text-slate-500 mb-2">Thank you for registering your church.</p>
      <p className="text-slate-500 mb-6">Our team will verify your church and contact you via the details provided.</p>
      <button className="btn-primary" onClick={() => setStatus('idle')}>Register Another Church</button>
    </div>
  )

  return (
    <div className="page-container max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-brand-900">Register Your Church</h1>
        <p className="text-slate-500 mt-2">Fill in the details below. Our team will verify and publish your church on FaithMap.</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">

        {/* Church Name */}
        <div>
          <label className="label">Church Name <span className="text-red-500">*</span></label>
          <input name="name" required value={form.name} onChange={handleChange} className="input" placeholder="e.g. St. Thomas Church"/>
        </div>

        {/* Denomination */}
        <div>
          <label className="label">Denomination <span className="text-red-500">*</span></label>
          <select name="denomination" required value={form.denomination} onChange={handleChange} className="input">
            <option value="">Select denomination</option>
            {DENOMINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          {form.denomination === 'Other' && (
            <input name="other_denomination" value={form.other_denomination} onChange={handleChange} className="input mt-2" placeholder="Please specify denomination"/>
          )}
        </div>

        {/* Area + City */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Area / Locality <span className="text-red-500">*</span></label>
            <input name="area" required value={form.area} onChange={handleChange} className="input" placeholder="e.g. Gottigere"/>
          </div>
          <div>
            <label className="label">City / Town <span className="text-red-500">*</span></label>
            <input name="city" required value={form.city} onChange={handleChange} className="input" placeholder="Bangalore"/>
          </div>
        </div>

        {/* Google Maps Location */}
        <div>
          <label className="label">Church Location on Google Maps <span className="text-red-500">*</span></label>
          <p className="text-xs text-slate-400 mb-2">Click the button below while you are at the church location. This helps users find you on the map.</p>
          <button type="button" onClick={captureLocation}
            className={`w-full py-3 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              locationStatus === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : locationStatus === 'error'
                ? 'bg-red-50 border-red-300 text-red-600'
                : locationStatus === 'loading'
                ? 'bg-brand-50 border-brand-300 text-brand-600'
                : 'bg-slate-50 border-slate-300 text-slate-600 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-600'
            }`}>
            {locationStatus === 'success' && <>📍 Location Captured! ({form.latitude?.toFixed(4)}, {form.longitude?.toFixed(4)})</>}
            {locationStatus === 'loading' && <>⏳ Getting your location…</>}
            {locationStatus === 'error' && <>❌ Failed. Please allow location access and try again</>}
            {locationStatus === 'idle' && <>📍 Capture Current Location</>}
          </button>
        </div>

        <hr className="border-slate-200"/>
        <p className="text-sm font-bold text-slate-600 uppercase tracking-wide">Contact Person</p>

        {/* Contact Name */}
        <div>
          <label className="label">Contact Person Name <span className="text-red-500">*</span></label>
          <input name="contact_name" required value={form.contact_name} onChange={handleChange} className="input" placeholder="Pastor / Admin name"/>
        </div>

        {/* Phone + Email */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Phone Number</label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} className="input" placeholder="+91 9XXXXXXXXX"/>
          </div>
          <div>
            <label className="label">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="input" placeholder="church@example.com"/>
          </div>
        </div>
        <p className="text-xs text-slate-400 -mt-3">At least one of phone or email is required.</p>

        <hr className="border-slate-200"/>
        <p className="text-sm font-bold text-slate-600 uppercase tracking-wide">Online Presence</p>

        {/* Website */}
        <div>
          <label className="label">Website</label>
          <input name="website" value={form.website} onChange={handleChange} className="input" placeholder="https://yourchurch.com"/>
        </div>

        {/* Social Media */}
        <div>
          <label className="label">Social Media Page</label>
          <input name="social_media" value={form.social_media} onChange={handleChange} className="input" placeholder="Facebook or Instagram link"/>
        </div>

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">{errorMsg}</div>
        )}

        <button type="submit" disabled={status === 'loading'} className="btn-primary w-full justify-center py-3">
          {status === 'loading' ? 'Submitting…' : 'Submit for Review'}
        </button>
      </form>
    </div>
  )
}
