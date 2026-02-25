import { Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'
import { formatPrice, pricingLabel, mlEstimate } from '../api'

const METRICS = [
  { key: 'price_in_euro',  label: 'Çmimi',       fmt: (v) => formatPrice(v) },
  { key: 'property_type',  label: 'Lloji',        fmt: (v) => v || '—' },
  { key: 'sqm',            label: 'm²',           fmt: (v) => v ? `${v} m²` : '—' },
  { key: 'bedrooms',       label: 'Dhoma',        fmt: (v) => v ?? '—' },
  { key: 'bathrooms',      label: 'Banjo',        fmt: (v) => v ?? '—' },
  { key: 'floor',          label: 'Kati',         fmt: (v) => v ?? '—' },
]

export default function ComparePage() {
  const { favs, toggle } = useFavorites()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-accent no-underline hover:gap-3 transition-all mb-4">
          ← Kthehu te listat
        </Link>
        <h1 className="font-display text-3xl text-[#e8f4fd]">⚖️ Krahaso Pronat</h1>
        <p className="text-muted text-sm mt-1">{favs.length} prona të ruajtura</p>
      </div>

      {/* Empty */}
      {favs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-muted">
          <span className="text-5xl mb-4">🤍</span>
          <p className="text-base mb-2">Nuk keni prona të ruajtura.</p>
          <p className="text-sm mb-6">Klikoni ❤️ në kartat e listimeve për t'i shtuar.</p>
          <Link to="/" className="text-accent text-sm underline">Shfleto pronat →</Link>
        </div>
      )}

      {/* Compare table */}
      {favs.length > 0 && (
        <div className="overflow-x-auto rounded-2xl"
          style={{ border: '1px solid rgba(100,180,255,0.10)' }}>
          <table className="w-full text-sm" style={{ minWidth: `${favs.length * 180 + 140}px` }}>
            <thead>
              <tr style={{ background: 'rgba(13,31,53,0.9)', borderBottom: '1px solid rgba(100,180,255,0.10)' }}>
                <th className="text-left p-4 text-muted font-semibold text-xs uppercase tracking-wider w-36">
                  Metrika
                </th>
                {favs.map(f => (
                  <th key={f.id} className="p-4 text-center" style={{ minWidth: 180 }}>
                    <div className="flex flex-col gap-2 items-center">
                      <div className="font-display text-base text-gold">{formatPrice(f.price_in_euro)}</div>
                      <div className="text-xs text-muted leading-tight line-clamp-2 max-w-[160px]">
                        {f.address || 'Adresë e panjohur'}
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/listings/${f.id}`}
                          className="text-[10px] text-accent hover:underline no-underline"
                        >
                          Shiko →
                        </Link>
                        <button
                          onClick={() => toggle(f)}
                          className="text-[10px] text-danger hover:underline"
                        >
                          Hiq ✕
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METRICS.map((metric, mi) => (
                <tr
                  key={metric.key}
                  style={{
                    background: mi % 2 === 0 ? 'rgba(10,25,41,0.75)' : 'rgba(13,31,53,0.5)',
                    borderBottom: '1px solid rgba(100,180,255,0.06)',
                  }}
                >
                  <td className="p-4 text-xs font-semibold uppercase tracking-wider text-muted">{metric.label}</td>
                  {favs.map(f => {
                    const raw = f[metric.key]
                    const display = metric.fmt(raw)
                    // Highlight best price
                    const isPrice = metric.key === 'price_in_euro'
                    const minPrice = isPrice ? Math.min(...favs.map(x => x.price_in_euro || Infinity)) : null
                    const isBest = isPrice && raw === minPrice
                    return (
                      <td key={f.id} className={`p-4 text-center font-medium ${isBest ? 'text-success' : 'text-[#e8f4fd]'}`}>
                        {display}
                        {isBest && <span className="ml-1 text-[10px] text-success">✓ Best</span>}
                      </td>
                    )
                  })}
                </tr>
              ))}
              {/* ML estimate row */}
              <tr style={{ background: 'rgba(79,195,247,0.04)', borderBottom: '1px solid rgba(100,180,255,0.06)' }}>
                <td className="p-4 text-xs font-semibold uppercase tracking-wider text-muted">ML Vlerësim</td>
                {favs.map(f => {
                  const { estimate } = mlEstimate(f)
                  const chip = pricingLabel(f.price_in_euro, estimate)
                  return (
                    <td key={f.id} className="p-4 text-center">
                      <div className="text-accent font-semibold">{formatPrice(estimate)}</div>
                      {chip && (
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mt-1 inline-block ${chip.color}`}>
                          {chip.label}
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Market insights */}
      {favs.length >= 2 && (
        <div className="mt-6 rounded-2xl p-5"
          style={{ background: 'rgba(13,31,53,0.75)', border: '1px solid rgba(100,180,255,0.10)' }}>
          <h3 className="font-display text-base text-[#e8f4fd] mb-3">📊 Analiza e Krahasimit</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-muted mb-0.5">Çmim mesatar</div>
              <div className="font-display text-lg text-gold">
                {formatPrice(Math.round(favs.reduce((s,f) => s + (f.price_in_euro||0), 0) / favs.length))}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted mb-0.5">Çmimi më i ulët</div>
              <div className="font-display text-lg text-success">
                {formatPrice(Math.min(...favs.map(f => f.price_in_euro || Infinity)))}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted mb-0.5">Çmimi më i lartë</div>
              <div className="font-display text-lg text-danger">
                {formatPrice(Math.max(...favs.map(f => f.price_in_euro || 0)))}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted mb-0.5">m² mesatare</div>
              <div className="font-display text-lg text-accent">
                {favs.filter(f=>f.sqm).length > 0
                  ? Math.round(favs.filter(f=>f.sqm).reduce((s,f)=>s+(f.sqm||0),0)/favs.filter(f=>f.sqm).length) + ' m²'
                  : '—'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
