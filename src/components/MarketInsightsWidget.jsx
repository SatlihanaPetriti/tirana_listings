// Market Insights Widget — derives stats from current items list
export default function MarketInsightsWidget({ items = [] }) {
  if (!items.length) return null

  // Avg price/sqm
  const withSqm = items.filter(i => i.price_in_euro && i.sqm && i.sqm > 0)
  const avgPsqm = withSqm.length
    ? Math.round(withSqm.reduce((s, i) => s + i.price_in_euro / i.sqm, 0) / withSqm.length)
    : null

  // Top neighborhoods by count
  const nbhd = {}
  items.forEach(i => {
    const n = i.address?.split(',')[1]?.trim() || i.address?.split(' ').slice(0,2).join(' ')
    if (n) nbhd[n] = (nbhd[n] || 0) + 1
  })
  const top3 = Object.entries(nbhd)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: 'rgba(13,31,53,0.75)', border: '1px solid rgba(79,195,247,0.15)', backdropFilter: 'blur(8px)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">📊</span>
        <h3 className="font-display text-sm text-[#e8f4fd]">Market Insights</h3>
      </div>

      {avgPsqm && (
        <div className="mb-3 pb-3" style={{ borderBottom: '1px solid rgba(100,180,255,0.08)' }}>
          <div className="text-[11px] uppercase tracking-wider text-muted mb-0.5">Mesatare €/m²</div>
          <div className="font-display text-2xl text-accent">€{avgPsqm.toLocaleString()}</div>
          <div className="text-xs text-muted">Tiranë (të gjitha zonat)</div>
        </div>
      )}

      {top3.length > 0 && (
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted mb-2">Top Zona</div>
          <div className="flex flex-col gap-1.5">
            {top3.map(([name, count], i) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{ background: 'rgba(79,195,247,0.15)', color: '#4fc3f7' }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-xs text-[#e8f4fd] truncate max-w-[120px]">{name}</span>
                </div>
                <span className="text-xs text-muted">{count} prona</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
