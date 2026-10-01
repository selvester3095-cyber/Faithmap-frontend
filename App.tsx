import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from '@/components/Header'
import { HomePage } from '@/pages/HomePage'
import { ChurchesPage } from '@/pages/ChurchesPage'
import { EventDetailPage } from '@/pages/EventDetailPage'

function App() {
  return (
    <Router>
      <div className="h-full flex flex-col bg-white">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/churches" element={<ChurchesPage />} />
          <Route path="/events/:eventId" element={<EventDetailPage />} />

          {/* Placeholder routes for future pages */}
          <Route path="/sign-in" element={<div className="page-container"><div className="text-center py-12">Sign In page coming soon</div></div>} />
          <Route path="*" element={<div className="page-container"><div className="text-center py-12">404 - Page not found</div></div>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
