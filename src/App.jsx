import React, { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function App() {
  const [portal, setPortal] = useState(localStorage.getItem('portal') || 'public')
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🙏 FaithMap
            </h1>
            <div className="flex gap-2 items-center">
              <button 
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  portal === 'public' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => {
                  setPortal('public')
                  localStorage.setItem('portal', 'public')
                }}
              >
                Discover
              </button>
              {token && (
                <>
                  <button 
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      portal === 'church' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setPortal('church')
                      localStorage.setItem('portal', 'church')
                    }}
                  >
                    Church
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      portal === 'admin' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setPortal('admin')
                      localStorage.setItem('portal', 'admin')
                    }}
                  >
                    Admin
                  </button>
                  <button 
                    className="px-4 py-2 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-all"
                    onClick={() => {
                      setToken(null)
                      setUser({})
                      localStorage.removeItem('token')
                      localStorage.removeItem('user')
                      setPortal('public')
                    }}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {portal === 'public' && <PublicPortal token={token} setToken={setToken} setUser={setUser} setPortal={setPortal} />}
        {portal === 'church' && token && <ChurchPortal token={token} user={user} />}
        {portal === 'admin' && token && <AdminPortal token={token} />}
      </div>
    </div>
  )
}

// ========== PUBLIC PORTAL ==========
function PublicPortal({ token, setToken, setUser, setPortal }) {
  const [churches, setChurches] = useState([])
  const [filters, setFilters] = useState({ denomination: '', distance: 10 })
  const [showLogin, setShowLogin] = useState(false)
  const [loginData, setLoginData] = useState({ phone: '', password: '' })
  const [registerData, setRegisterData] = useState({ phone: '', otp: '', password: '' })
  const [showRegister, setShowRegister] = useState(false)
  const [registerStep, setRegisterStep] = useState(1)

  useEffect(() => {
    fetchChurches()
  }, [filters])

  const fetchChurches = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/churches`, {
      params: { denomination: filters.denomination, distance_km: filters.distance }
    })
    setChurches(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error('Error fetching churches:', error)
    }
  }

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/auth/login`, {
        phone_number: loginData.phone,
        password: loginData.password
      })
      setToken(response.data.token)
      setUser(response.data)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data))
      setShowLogin(false)
      setPortal('church')
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.detail || 'Unknown error'))
    }
  }

  const handleRegisterStep1 = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/auth/register`, {
        phone_number: registerData.phone,
        email: registerData.phone + '@faithmap.in',
        full_name: 'Pastor'
      })
      alert('OTP sent: ' + response.data.otp)
      setRegisterStep(2)
    } catch (error) {
      alert('Registration failed: ' + (error.response?.data?.detail || 'Unknown error'))
    }
  }

  const handleRegisterStep2 = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/auth/verify-otp`, {
        phone_number: registerData.phone,
        otp_code: registerData.otp,
        password: registerData.password
      })
      setToken(response.data.token)
      setUser(response.data)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data))
      setShowRegister(false)
      setPortal('church')
    } catch (error) {
      alert('Verification failed: ' + (error.response?.data?.detail || 'Unknown error'))
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Discover Churches Near You</h2>
        <p className="text-gray-600">Find local churches and their events in your area</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Denomination</label>
            <select 
              value={filters.denomination} 
              onChange={(e) => setFilters({...filters, denomination: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Denominations</option>
              <option value="Pentecostal">Pentecostal</option>
              <option value="Catholic">Catholic</option>
              <option value="Orthodox">Orthodox</option>
              <option value="Baptist">Baptist</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Distance: {filters.distance} km</label>
            <input 
              type="range" 
              min="1" 
              max="50" 
              value={filters.distance}
              onChange={(e) => setFilters({...filters, distance: e.target.value})}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {!token && (
            <div className="flex gap-2">
              <button 
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => { setShowLogin(true); setShowRegister(false) }}
              >
                Sign In
              </button>
              <button 
                className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                onClick={() => { setShowRegister(true); setShowLogin(false) }}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Pastor Login</h3>
            <input 
              type="text" 
              placeholder="Phone Number"
              value={loginData.phone}
              onChange={(e) => setLoginData({...loginData, phone: e.target.value})}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input 
              type="password" 
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mb-3"
              onClick={handleLogin}
            >
              Login
            </button>
            <button 
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              onClick={() => setShowLogin(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {registerStep === 1 ? 'Register Church' : 'Verify OTP'}
            </h3>
            {registerStep === 1 ? (
              <>
                <input 
                  type="text" 
                  placeholder="Phone Number"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({...registerData, phone: e.target.value})}
                  className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button 
                  className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mb-3"
                  onClick={handleRegisterStep1}
                >
                  Send OTP
                </button>
              </>
            ) : (
              <>
                <input 
                  type="text" 
                  placeholder="OTP"
                  value={registerData.otp}
                  onChange={(e) => setRegisterData({...registerData, otp: e.target.value})}
                  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input 
                  type="password" 
                  placeholder="Password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button 
                  className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mb-3"
                  onClick={handleRegisterStep2}
                >
                  Verify & Register
                </button>
              </>
            )}
            <button 
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              onClick={() => { setShowRegister(false); setRegisterStep(1) }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Churches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {churches.map(church => (
          <div key={church.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
            <div className="mb-4">
              <h4 className="text-lg font-bold text-gray-900 mb-2">✝️ {church.church_name}</h4>
              <p className="text-sm font-medium text-blue-600 mb-1">{church.denomination}</p>
              <p className="text-sm text-gray-600">{church.address}</p>
            </div>
            <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-shadow">
              View Details
            </button>
          </div>
        ))}
      </div>

      {churches.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-600">No churches found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  )
}

// ========== CHURCH PORTAL ==========
function ChurchPortal({ token, user }) {
  const [church, setChurch] = useState(null)
  const [events, setEvents] = useState([])
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [newEvent, setNewEvent] = useState({
    event_name: '',
    event_type: 'service',
    description: '',
    start_time: ''
  })

  useEffect(() => {
    if (user.church_id) {
      fetchChurch()
      fetchEvents()
    }
  }, [user])

  const fetchChurch = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/churches/${user.church_id}`)
      setChurch(response.data)
    } catch (error) {
      console.error('Error fetching church:', error)
    }
  }

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/churches/${user.church_id}/events`)
      setEvents(response.data)
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  const handleAddEvent = async () => {
    try {
      await axios.post(
        `${API_URL}/api/v1/churches/${user.church_id}/events`,
        newEvent,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      setShowAddEvent(false)
      setNewEvent({ event_name: '', event_type: 'service', description: '', start_time: '' })
      fetchEvents()
      alert('Event created successfully!')
    } catch (error) {
      alert('Error creating event: ' + (error.response?.data?.detail || 'Unknown error'))
    }
  }

  return (
    <div className="space-y-8">
      {church && (
        <>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">{church.church_name}</h2>
            <div className="flex items-center gap-2">
              <span className="inline-block px-4 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                ✓ Verified
              </span>
              <p className="text-blue-100">{church.denomination}</p>
            </div>
          </div>

          <button 
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-shadow text-lg"
            onClick={() => setShowAddEvent(true)}
          >
            + Add New Event
          </button>

          {showAddEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h3>
                <input 
                  type="text" 
                  placeholder="Event Name"
                  value={newEvent.event_name}
                  onChange={(e) => setNewEvent({...newEvent, event_name: e.target.value})}
                  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select 
                  value={newEvent.event_type}
                  onChange={(e) => setNewEvent({...newEvent, event_type: e.target.value})}
                  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="service">Sunday Service</option>
                  <option value="prayer">Prayer Meeting</option>
                  <option value="youth">Youth Event</option>
                  <option value="fellowship">Fellowship</option>
                  <option value="love_feast">Love Feast</option>
                </select>
                <textarea 
                  placeholder="Description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input 
                  type="datetime-local"
                  value={newEvent.start_time}
                  onChange={(e) => setNewEvent({...newEvent, start_time: e.target.value})}
                  className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button 
                  className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors mb-3"
                  onClick={handleAddEvent}
                >
                  Create Event
                </button>
                <button 
                  className="w-full px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={() => setShowAddEvent(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h3>
            {events.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No events yet. Create your first event!</p>
            ) : (
              <div className="space-y-4">
                {events.map(event => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <h5 className="font-bold text-gray-900 mb-1">{event.event_name}</h5>
                    <p className="text-sm text-blue-600 font-medium mb-2">{event.event_type}</p>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

// ========== ADMIN PORTAL ==========
function AdminPortal({ token }) {
  const [stats, setStats] = useState(null)
  const [pendingChurches, setPendingChurches] = useState([])
  const [activeTab, setActiveTab] = useState('pending')

  useEffect(() => {
    fetchStats()
    fetchPendingChurches()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchPendingChurches = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/admin/churches/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setPendingChurches(response.data)
    } catch (error) {
      console.error('Error fetching pending churches:', error)
    }
  }

  const verifyChurch = async (churchId) => {
    try {
      await axios.put(`${API_URL}/api/v1/admin/churches/${churchId}/verify`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      fetchStats()
      fetchPendingChurches()
      alert('Church verified!')
    } catch (error) {
      alert('Error verifying church')
    }
  }

  const deleteChurch = async (churchId) => {
    if (confirm('Are you sure you want to delete this church?')) {
      try {
        await axios.delete(`${API_URL}/api/v1/admin/churches/${churchId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        fetchStats()
        fetchPendingChurches()
        alert('Church deleted!')
      } catch (error) {
        alert('Error deleting church')
      }
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-600 mt-2">Manage churches, events, and reviews</p>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-blue-100 text-sm font-medium mb-2">Total Churches</p>
            <h4 className="text-4xl font-bold">{stats.total_churches}</h4>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-orange-100 text-sm font-medium mb-2">Pending</p>
            <h4 className="text-4xl font-bold">{stats.pending_churches}</h4>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-emerald-100 text-sm font-medium mb-2">Total Events</p>
            <h4 className="text-4xl font-bold">{stats.total_events}</h4>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-lg shadow-lg p-6 text-white">
            <p className="text-pink-100 text-sm font-medium mb-2">Reviews Pending</p>
            <h4 className="text-4xl font-bold">{stats.pending_reviews}</h4>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button 
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'pending' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('pending')}
        >
          Pending Churches
        </button>
        <button 
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'reviews' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </button>
      </div>

      {activeTab === 'pending' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Churches Awaiting Verification</h3>
          {pendingChurches.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-600">No pending churches</p>
            </div>
          ) : (
            pendingChurches.map(church => (
              <div key={church.id} className="bg-white rounded-lg border border-gray-200 p-6 flex justify-between items-start hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <h5 className="font-bold text-gray-900 text-lg mb-2">{church.church_name}</h5>
                  <p className="text-sm text-gray-600 mb-1">{church.denomination}</p>
                  <p className="text-sm text-gray-500">{church.address}</p>
                </div>
                <div className="flex gap-3 ml-4">
                  <button 
                    className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                    onClick={() => verifyChurch(church.id)}
                  >
                    ✓ Verify
                  </button>
                  <button 
                    className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                    onClick={() => deleteChurch(church.id)}
                  >
                    ✕ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Review management coming soon...</p>
        </div>
      )}
    </div>
  )
}
