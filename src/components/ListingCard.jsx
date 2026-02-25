import { Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'
import { formatPrice, pricingLabel, mlEstimate } from '../api'

// Deterministic gradient placeholder based on id
function PhotoPlaceholder({ item }) {
  const seed = (item.id || '').toString().charCodeAt(0) % 6
  const gradients = [
    'from-blue-900 to-cyan-900',
    'from-slate-800 to-blue-900',
    'from-indigo-900 to-slate-900',
    'from-cyan-900 to-teal-900',
    'from-sky-900 to-indigo-900',
    'from-blue-950 to-cyan-800',
  ]
  const icons = ['🏢','🏠','🏗️','🏬','🏛️','🏙️']
  return (
    <div className={`h-44 bg-gradient-to-br ${gradients[seed]} flex items-center justify-center relative overflow-hidden`}>
      <span className="text-5xl opacity-30">{icons[seed]}</span>
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      {item.property_type && (
        <div
          className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(79,195,247,0.18)', border: '1px solid rgba(79,195,247,0.3)', color: '#4fc3f7' }}
        >
          {item.property_type}
        </div>
      )}
    </div>
  )
}

export default function ListingCard({ item, index = 0 }) {
  const { toggle, isFav } = useFavorites()
  const fav = isFav(item.id)

  const { estimate } = mlEstimate(item)
  const chip = pricingLabel(item.price_in_euro, estimate)

  const address = item.address || 'Adresë e panjohur'
  const meta = [
    item.bedrooms  != null && `🛏 ${item.bedrooms}`,
    item.bathrooms != null && `🚿 ${item.bathrooms}`,
    item.sqm       != null && `📐 ${item.sqm} m²`,
  ].filter(Boolean)

  return (
    <div
      className="group rounded-2xl overflow-hidden flex flex-col animate-fade-up"
      style={{
        background: 'rgba(10,25,41,0.75)',
        border: '1px solid rgba(100,180,255,0.10)',
        animationDelay: `${Math.min(index * 50, 500)}ms`,
        transition: 'transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
      }}
      onMouseOver={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.borderColor = 'rgba(79,195,247,0.3)'
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)'
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = ''
        e.currentTarget.style.borderColor = 'rgba(100,180,255,0.10)'
        e.currentTarget.style.boxShadow = ''
      }}
    >
      {/* Photo */}
      <div className="relative">
        <PhotoPlaceholder item={item} />
        {/* Heart */}
        <button
          onClick={(e) => { e.preventDefault(); toggle(item) }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{
            background: fav ? 'rgba(239,68,68,0.85)' : 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(6px)',
            border: fav ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.15)',
          }}
          title={fav ? 'Hiq nga të preferuarat' : 'Shto te të preferuarat'}
        >
          <span className="text-sm">{fav ? '❤️' : '🤍'}</span>
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Price + chip */}
        <div className="flex items-start justify-between gap-2">
          <span className="font-display text-xl text-gold leading-none">
            {formatPrice(item.price_in_euro)}
          </span>
          {chip && (
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${chip.color}`}>
              {chip.label}
            </span>
          )}
        </div>

        {/* Address */}
        <p className="text-sm font-medium text-[#e8f4fd] leading-snug line-clamp-2">
          {address}
        </p>

        {/* Meta chips */}
        {meta.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {meta.map(m => (
              <span
                key={m}
                className="text-xs text-muted px-2 py-0.5 rounded-md"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(100,180,255,0.10)' }}
              >
                {m}
              </span>
            ))}
          </div>
        )}

        {/* View button */}
        <Link
          to={`/listings/${item.id}`}
          className="mt-2 block text-center text-sm font-semibold py-2 rounded-xl transition-all no-underline"
          style={{
            background: 'rgba(79,195,247,0.10)',
            border: '1px solid rgba(79,195,247,0.22)',
            color: '#4fc3f7',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(79,195,247,0.2)'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(79,195,247,0.10)'}
        >
          Shiko detajet →
        </Link>
      </div>
    </div>
  )
}
