export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

// ─── Formatters ───────────────────────────────────────────────────────────────
export function formatPrice(value) {
  if (value === null || value === undefined) return 'N/A'
  try { return '€' + new Intl.NumberFormat('en-US').format(value) }
  catch { return '€' + value }
}

export function formatBool(value) {
  if (value === true)  return { label: 'Po ✓',  ok: true  }
  if (value === false) return { label: 'Jo ✗',  ok: false }
  return { label: '—', ok: null }
}

// ─── Pricing label ────────────────────────────────────────────────────────────
// Returns { label, color } based on price vs estimated value
export function pricingLabel(price, estimatedValue) {
  if (!price || !estimatedValue) return null
  const ratio = price / estimatedValue
  if (ratio > 1.12)  return { label: 'Overpriced',   color: 'text-danger  bg-danger/10  border-danger/30'  }
  if (ratio < 0.88)  return { label: 'Underpriced',  color: 'text-success bg-success/10 border-success/30' }
  return               { label: 'Fair',          color: 'text-gold    bg-gold/10    border-gold/30'    }
}

// ─── ML Estimate (derived from listing data) ──────────────────────────────────
export function mlEstimate(item) {
  const sqm   = item.main_property_property_square  || item.sqm  || 80
  const beds  = item.main_property_property_composition_bedrooms  || item.bedrooms  || 2
  const floor = item.main_property_floor            || item.floor || 3
  const hasElevator = item.main_property_has_elevator || false
  const isFurnished = item.main_property_is_furnished || false

  // Rough Albania/Tirana price model: base €1400/sqm + adjustments
  let base = sqm * 1400
  base += beds  * 4000
  base += floor * 1200
  if (hasElevator) base += 6000
  if (isFurnished) base += 8000

  const low  = Math.round(base * 0.88 / 100) * 100
  const high = Math.round(base * 1.12 / 100) * 100
  const mid  = Math.round(base / 100) * 100
  return { estimate: mid, low, high }
}

// ─── API calls ────────────────────────────────────────────────────────────────
export async function fetchListings({
  q         = '',
  limit     = 20,
  page      = 1,
  sqm_min   = '',
  sqm_max   = '',
  bedrooms  = '',
  price_min = '',
  price_max = '',
  baths     = '',
  elevator  = '',
  garden    = '',
  parking   = '',
  furnished = '',
  sort      = '',
} = {}) {
  const url = new URL(`${API_BASE}/listings`)
  const s = url.searchParams

  const set = (k, v) => { if (v !== '' && v !== null && v !== undefined) s.set(k, String(v)) }

  set('limit',     isNaN(Number(limit)) ? 20 : limit)
  set('offset',    (page - 1) * (isNaN(Number(limit)) ? 20 : Number(limit)))
  set('q',         q.trim())
  set('sqm_min',   sqm_min)
  set('sqm_max',   sqm_max)
  set('bedrooms',  bedrooms)
  set('price_min', price_min)
  set('price_max', price_max)
  set('baths',     baths)
  set('elevator',  elevator ? 'true' : '')
  set('garden',    garden   ? 'true' : '')
  set('parking',   parking  ? 'true' : '')
  set('furnished', furnished)
  set('sort',      sort)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchListing(id) {
  const res = await fetch(`${API_BASE}/listings/${encodeURIComponent(id)}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
