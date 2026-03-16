import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ChurchDetailPage from './pages/ChurchDetailPage'
import RegisterChurchPage from './pages/RegisterChurchPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboard from './pages/AdminDashboard'
import ChurchLoginPage from './pages/ChurchLoginPage'
import ChurchDashboard from './pages/ChurchDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* End User */}
            <Route path="/" element={<HomePage />} />
            <Route path="/churches/:id" element={<ChurchDetailPage />} />
            <Route path="/register" element={<RegisterChurchPage />} />
            {/* Admin */}
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {/* Church Portal */}
            <Route path="/church" element={<ChurchLoginPage />} />
            <Route path="/church/dashboard" element={<ChurchDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
