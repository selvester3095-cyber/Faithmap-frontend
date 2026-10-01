import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export const Header = () => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="sticky-header">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="text-2xl">⛪</div>
          <div className="font-display font-bold text-lg text-faith-navy-900">Faithmap</div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm font-semibold transition ${
              isActive('/') ? 'text-faith-green-400' : 'text-gray-600 hover:text-faith-green-400'
            }`}
          >
            Explore Events
          </Link>
          <Link
            to="/churches"
            className={`text-sm font-semibold transition ${
              isActive('/churches') ? 'text-faith-green-400' : 'text-gray-600 hover:text-faith-green-400'
            }`}
          >
            Churches
          </Link>
          <a href="#" className="text-sm font-semibold text-gray-600 hover:text-faith-green-400">
            About
          </a>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link to="/sign-in" className="btn-primary hidden md:inline-flex">
            👤 Sign In
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 p-6 space-y-4">
            <Link
              to="/"
              className="block text-sm font-semibold text-faith-navy-900 hover:text-faith-green-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore Events
            </Link>
            <Link
              to="/churches"
              className="block text-sm font-semibold text-faith-navy-900 hover:text-faith-green-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              Churches
            </Link>
            <a href="#" className="block text-sm font-semibold text-faith-navy-900 hover:text-faith-green-400">
              About
            </a>
            <Link to="/sign-in" className="btn-primary w-full justify-center">
              👤 Sign In
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
