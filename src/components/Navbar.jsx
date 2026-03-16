import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const isAdmin = pathname.startsWith('/admin')
  const isChurch = pathname.startsWith('/church')

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">✝</span>
          <span className="font-display text-xl text-brand-900">FaithMap</span>
        </Link>

        <nav className="flex items-center gap-6">
          {!isAdmin && !isChurch && (
            <>
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${pathname === '/' ? 'text-brand-600' : 'text-slate-600 hover:text-brand-600'}`}
              >
                Find Church
              </Link>
              <Link
                to="/register"
                className={`text-sm font-medium transition-colors ${pathname === '/register' ? 'text-brand-600' : 'text-slate-600 hover:text-brand-600'}`}
              >
                Register Church
              </Link>
              <Link
                to="/church"
                className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors"
              >
                Church Login
              </Link>
            </>
          )}

          {isAdmin && (
            <button
              onClick={() => { localStorage.removeItem('adminToken'); navigate('/admin') }}
              className="text-sm font-medium text-red-500 hover:text-red-700"
            >
              Logout
            </button>
          )}

          {isChurch && (
            <button
              onClick={() => { localStorage.removeItem('churchToken'); navigate('/church') }}
              className="text-sm font-medium text-red-500 hover:text-red-700"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
