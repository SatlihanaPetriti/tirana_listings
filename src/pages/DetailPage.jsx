import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'
import { fetchListing, formatPrice, formatBool, pricingLabel, mlEstimate } from '../api'

// ─── ML Estimate Range Bar ────────────────────────────────────────────────────
function MLEstimateBox({ item }) {
  const { estimate, low, high } = mlEstimate(item)
  const price = item.price_in_euro || 0
  const chip = pricingLabel(price, estimate)

  // Pin position as % in range [low*0.8 .. high*1.2]
  const rangeMin = low  * 0.85
  const rangeMax = high * 1.15
  const fillL = ((low  - rangeMin) / (rangeMax - rangeMin)) * 100
  const fillR = ((high - rangeMin) / (rangeMax - rangeMin)) * 100
  const pinPct = Math.max(0, Math.min(100, ((price - rangeMin) / (rangeMax - rangeMin)) * 100))
  const estPct = ((estimate - rangeMin) / (rangeMax - rangeMin)) * 100

  return (
    <div className="rounded-2xl p-5"
      style={{ background: 'rgba(13,31,53,0.75)', border: '1px solid rgba(79,195,247,0.15)' }}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🤖</span>
        <h3 className="font-display text-base text-[#e8f4fd]">ML Vlerësimi</h3>
        {chip && (
          <span className={`ml-auto text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${chip.color}`}>
            {chip.label}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="text-center">
          <div className="text-xs text-muted mb-0.5">Çmimi real</div>
          <div className="font-display text-base text-gold">{formatPrice(price)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted mb-0.5">Vlerësimi</div>
          <div className="font-display text-base text-accent">{formatPrice(estimate)}</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted mb-0.5">Diapazoni i drejtë</div>
          <div className="text-xs font-semibold text-[#e8f4fd]">{formatPrice(low)} – {formatPrice(high)}</div>
        </div>
      </div>

      {/* Range bar */}
      <div className="relative h-3 rounded-full mb-6" style={{ background: 'rgba(79,195,247,0.08)' }}>
        {/* Fair range fill */}
        <div className="range-bar-fill absolute h-full rounded-full" style={{ left: `${fillL}%`, width: `${fillR - fillL}%` }} />
        {/* Estimate pin */}
        <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent border-2 border-bg"
          style={{ left: `${estPct}%`, transform: 'translate(-50%,-50%)', boxShadow: '0 0 6px rgba(79,195,247,0.6)' }} />
        {/* Price pin */}
        {price > 0 && (
          <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gold border-2 border-bg"
            style={{ left: `${pinPct}%`, transform: 'translate(-50%,-50%)', boxShadow: '0 0 8px rgba(255,213,79,0.7)' }} />
        )}
      </div>

      <div className="flex justify-between text-[10px] text-muted">
        <span>{formatPrice(rangeMin)}</span>
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent inline-block" />Vlerësim</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gold inline-block" />Çmim real</span>
        </div>
        <span>{formatPrice(rangeMax)}</span>
      </div>
    </div>
  )
}

// ─── Comps section ────────────────────────────────────────────────────────────
function CompsSection({ item }) {
  // Generate 5 synthetic comps based on the listing
  const sqm   = item.main_property_property_square || 80
  const price = item.price_in_euro || 100000
  const beds  = item.main_property_property_composition_bedrooms || 2
  const addr  = item.main_property_location_city_zone_formatted_address || ''

  const reasons = [
    ['Same neighborhood', '📍'],
    ['Similar size',      '📐'],
    ['Same floor count',  '🏢'],
    ['Same type',         '🏠'],
    ['Nearby area',       '🗺️'],
  ]

  const comps = reasons.map(([reason, icon], i) => {
    const variance = 0.85 + (i * 0.08)
    const sqmVar   = Math.round(sqm * (0.9 + i * 0.05))
    const priceVar = Math.round(price * variance / 1000) * 1000
    const bedsVar  = Math.max(1, beds + (i % 2 === 0 ? 0 : 1))
    return { reason, icon, sqm: sqmVar, price: priceVar, beds: bedsVar, id: `comp-${i}` }
  })

  return (
    <div>
      <h2 className="font-display text-xl text-[#e8f4fd] mb-4 flex items-center gap-2">
        🏘️ Prona të Ngjashme
        <span className="h-px flex-1 bg-white/5" />
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {comps.map((c) => (
          <div key={c.id} className="rounded-xl p-3 flex flex-col gap-2"
            style={{ background: 'rgba(10,25,41,0.75)', border: '1px solid rgba(100,180,255,0.10)' }}>
            <div className="font-display text-base text-gold">{formatPrice(c.price)}</div>
            <div className="flex flex-wrap gap-1">
              <span className="text-xs text-muted px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.04)' }}>
                🛏 {c.beds}
              </span>
              <span className="text-xs text-muted px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.04)' }}>
                📐 {c.sqm} m²
              </span>
            </div>
            <div
              className="text-[11px] px-2 py-1 rounded-full text-center font-medium"
              style={{ background: 'rgba(79,195,247,0.10)', color: '#4fc3f7', border: '1px solid rgba(79,195,247,0.2)' }}
            >
              {c.icon} {c.reason}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Key fact item ────────────────────────────────────────────────────────────
function Fact({ label, value, ok }) {
  const color = ok === true ? 'text-success' : ok === false ? 'text-danger' : 'text-[#e8f4fd]'
  return (
    <div className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl"
      style={{ background: 'rgba(10,25,41,0.6)', border: '1px solid rgba(100,180,255,0.08)' }}>
      <div className="text-[11px] uppercase tracking-wider text-muted text-center">{label}</div>
      <div className={`text-base font-semibold ${color} text-center`}>{value ?? '—'}</div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DetailPage() {
  const { id } = useParams()
  const [item, setItem]   = useState(null)
  const [loading, setLoad] = useState(true)
  const [error, setError]  = useState(null)
  const { toggle, isFav }  = useFavorites()

  useEffect(() => {
    setLoad(true); setError(null); setItem(null)
    fetchListing(id)
      .then(setItem)
      .catch(e => setError(e.message))
      .finally(() => setLoad(false))
  }, [id])

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="h-64 skeleton rounded-2xl mb-6" />
      <div className="h-8 w-64 skeleton rounded-xl mb-4" />
      <div className="h-4 w-full skeleton rounded mb-2" />
      <div className="h-4 w-3/4 skeleton rounded" />
    </div>
  )

  if (error) return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="rounded-xl p-5 text-danger text-sm"
        style={{ background: 'rgba(239,154,154,0.08)', border: '1px solid rgba(239,154,154,0.25)' }}>
        ⚠️ Nuk mund të ngarkohet prona.<br /><small className="opacity-70">{error}</small>
      </div>
    </div>
  )

  if (!item) return null

  const address  = item.main_property_location_city_zone_formatted_address || 'Adresë e panjohur'
  const price    = item.price_in_euro
  const type     = item.main_property_property_type
  const sqm      = item.main_property_property_square
  const beds     = item.main_property_property_composition_bedrooms
  const baths    = item.main_property_property_composition_bathrooms
  const floor    = item.main_property_floor
  const desc     = item.main_property_description_text_content_original_text
  const lat      = item.main_property_location_city_zone_lat
  const lng      = item.main_property_location_city_zone_lng

  const elevator = formatBool(item.main_property_has_elevator)
  const terrace  = formatBool(item.main_property_has_terrace)
  const parking  = formatBool(item.main_property_has_parking)
  const furnished = item.main_property_is_furnished
    ? 'Mobiluar' : item.main_property_is_furnished === false ? 'Pa mobilim' : '—'

  const chip = pricingLabel(price, mlEstimate(item).estimate)
  const fav  = isFav(item.id)

  // Simplified listing obj for favorites
  const listingForFav = {
    id: item.id || id,
    address,
    price_in_euro: price,
    property_type: type,
    sqm, beds, baths,
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-accent hover:gap-3 transition-all no-underline w-fit"
      >
        ← Kthehu te listat
      </Link>

      {/* ── Hero section ────────────────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(13,31,53,0.75)', border: '1px solid rgba(100,180,255,0.12)' }}
      >
        {/* Photo hero */}
        <div className="h-56 sm:h-72 bg-gradient-to-br from-slate-800 to-blue-900 flex items-center justify-center relative">
          <span className="text-8xl opacity-20">🏙️</span>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
            <div>
              {type && (
                <div className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-2 w-fit"
                  style={{ background: 'rgba(79,195,247,0.18)', border: '1px solid rgba(79,195,247,0.3)', color: '#4fc3f7' }}>
                  {type}
                </div>
              )}
              <h1 className="font-display text-2xl sm:text-3xl text-white leading-tight drop-shadow-lg">{address}</h1>
            </div>
            <button
              onClick={() => toggle(listingForFav)}
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all"
              style={{
                background: fav ? 'rgba(239,68,68,0.85)' : 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(6px)',
                border: fav ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <span className="text-lg">{fav ? '❤️' : '🤍'}</span>
            </button>
          </div>
        </div>

        {/* Price + chip */}
        <div className="px-5 py-4 flex items-center gap-4 flex-wrap"
          style={{ borderBottom: '1px solid rgba(100,180,255,0.08)' }}>
          <span className="font-display text-4xl text-gold">{formatPrice(price)}</span>
          {chip && (
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${chip.color}`}>
              {chip.label}
            </span>
          )}
        </div>

        {/* ── Key facts bar ────────────────────────────────────── */}
        <div className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            <Fact label="Dhoma"    value={beds} />
            <Fact label="Banjo"    value={baths} />
            <Fact label="m²"       value={sqm} />
            <Fact label="Kati"     value={floor} />
            <Fact label="Mobilim"  value={furnished} />
            <Fact label="Ashensor" value={elevator.label} ok={elevator.ok} />
            <Fact label="Tarracë"  value={terrace.label}  ok={terrace.ok}  />
          </div>
        </div>
      </div>

      {/* ── ML Estimate ─────────────────────────────────────── */}
      <MLEstimateBox item={item} />

      {/* ── Description ─────────────────────────────────────── */}
      {desc && (
        <div>
          <h2 className="font-display text-xl text-[#e8f4fd] mb-3 flex items-center gap-2">
            📝 Përshkrimi
            <span className="h-px flex-1 bg-white/5" />
          </h2>
          <div
            className="rounded-2xl p-5 text-sm leading-relaxed text-[#c8dff0] whitespace-pre-wrap font-light"
            style={{ background: 'rgba(10,25,41,0.6)', border: '1px solid rgba(100,180,255,0.08)' }}
          >
            {desc}
          </div>
        </div>
      )}

      {/* ── GPS / Map ────────────────────────────────────────── */}
      {(lat || lng) && (
        <div>
          <h2 className="font-display text-xl text-[#e8f4fd] mb-3 flex items-center gap-2">
            📍 Vendndodhja
            <span className="h-px flex-1 bg-white/5" />
          </h2>
          <div className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(100,180,255,0.10)' }}>
            {lat && lng ? (
              <img
                src={`https://maps.geoapify.com/v1/staticmap?style=dark-matter&width=900&height=280&center=lonlat:${lng},${lat}&zoom=15&marker=lonlat:${lng},${lat};color:%234fc3f7;size:large&apiKey=YOUR_KEY_HERE`}
                alt="Map"
                className="w-full h-52 object-cover"
                style={{ filter: 'saturate(0.8) brightness(0.85)' }}
                onError={e => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
            ) : null}
            <div
              className="h-52 items-center justify-center flex-col gap-2 text-muted text-sm hidden"
              style={{ background: 'rgba(10,25,41,0.6)' }}
            >
              <span className="text-3xl">📍</span>
              <span>Lat: {lat} · Lng: {lng}</span>
            </div>
            <div className="px-4 py-2 text-xs text-muted flex gap-4"
              style={{ background: 'rgba(10,25,41,0.8)', borderTop: '1px solid rgba(100,180,255,0.08)' }}>
              {lat && <span>📍 {lat}</span>}
              {lng && <span>🌐 {lng}</span>}
              {lat && lng && (
                <a
                  href={`https://www.google.com/maps?q=${lat},${lng}`}
                  target="_blank" rel="noreferrer"
                  className="ml-auto text-accent hover:underline"
                >
                  Hap në Google Maps ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Comps ────────────────────────────────────────────── */}
      <CompsSection item={item} />
    </div>
  )
}
