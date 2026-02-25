import { Link, useLocation } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'
import { API_BASE } from '../api'

export default function Navbar() {
  const { favs } = useFavorites()
  const loc = useLocation()

  const link = (to) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
      loc.pathname === to
        ? 'bg-accent/15 text-accent border border-accent/30'
        : 'text-muted hover:text-[#e8f4fd] hover:bg-white/5'
    }`

  return (
    <nav
      className="sticky top-0 z-50 flex items-center gap-4 px-6 h-[62px] border-b"
      style={{
        background: 'rgba(7,17,31,0.88)',
        backdropFilter: 'blur(14px)',
        borderColor: 'rgba(100,180,255,0.10)',
      }}
    >
      {/* Brand */}
      <Link to="/" className="flex items-center gap-2 no-underline">
        <span className="text-2xl">🏙️</span>
        <span className="font-display text-xl text-accent">
          Tirana<span className="text-gold">Listings</span>
        </span>
        <span
          className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(79,195,247,0.12)', border: '1px solid rgba(79,195,247,0.28)', color: '#4fc3f7' }}
        >
          Beta
        </span>
      </Link>

      {/* Routes */}
      <div className="flex items-center gap-2 ml-4">
        <Link to="/" className={link('/')}>Listimet</Link>
        <Link to="/compare" className={`${link('/compare')} relative`}>
          Krahaso
          {favs.length > 0 && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ background: '#4fc3f7', color: '#07111f' }}
            >
              {favs.length}
            </span>
          )}
        </Link>
      </div>

      {/* Right */}
      <div className="ml-auto flex items-center gap-3">
        <span
          className="w-2 h-2 rounded-full animate-pulse-dot"
          style={{ background: '#69f0ae', boxShadow: '0 0 8px #69f0ae' }}
        />
        <span className="text-xs text-muted hidden sm:block">{API_BASE}</span>
      </div>
    </nav>
  )
}
