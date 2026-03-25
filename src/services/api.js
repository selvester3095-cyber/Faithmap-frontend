import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE || 'https://faithmap-backend.onrender.com'

const api = axios.create({ baseURL: BASE_URL, headers: { 'Content-Type': 'application/json' } })

const authApi = (token) => axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
})

// ── Public ───────────────────────────────────────────────
export const getChurches = (params) => api.get('/churches', { params })
export const getChurchById = (id) => api.get(`/churches/${id}`)
export const getAllEvents = (params) => api.get('/churches/events', { params })
export const registerChurch = (data) => api.post('/churches', data)
export const markInterest = (eventId) => api.post(`/churches/${eventId}/interest`)

// ── Auth ─────────────────────────────────────────────────
export const adminLogin = (data) => api.post('/auth/admin/login', data)
export const churchLogin = (data) => api.post('/auth/church/login', data)

// ── Admin ─────────────────────────────────────────────────
export const getSubmittedChurches = (token, status = 'submitted', search = '') =>
  api.get(`/admin/churches?status=${status}&search=${search}`)
export const getAdminChurch = (token, id) => api.get(`/admin/churches/${id}`)
export const getEventCount = (token, id) => api.get(`/admin/churches/${id}/event-count`)
export const verifyChurch = (token, id) => api.post(`/admin/verify/${id}`)
export const rejectChurch = (token, id) => api.post(`/admin/churches/${id}/reject`)
export const reviewChurch = (token, id) => api.post(`/admin/churches/${id}/review`)
export const resubmitChurch = (token, id) => api.post(`/admin/churches/${id}/resubmit`)
export const deleteChurch = (token, id) => api.delete(`/admin/churches/${id}`)

// ── Church Portal ─────────────────────────────────────────
export const getMyChurch = (token) => authApi(token).get('/portal/me')
export const getMyEvents = (token) => authApi(token).get('/portal/events')
export const addEvent = (token, data) => authApi(token).post('/portal/events', data)
export const updateEvent = (token, id, data) => authApi(token).put(`/portal/events/${id}`, data)
export const deleteEvent = (token, id) => authApi(token).delete(`/portal/events/${id}`)
export const changePassword = (token, data) => authApi(token).post('/portal/change-password', data)
