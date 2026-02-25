import { useState } from 'react'

const FURNISHED_OPTIONS = [
  { val: '',                 label: 'Të gjitha' },
  { val: 'furnished',        label: '🪑 Mobiluar' },
  { val: 'unfurnished',      label: '🚫 Pa mobilim' },
  { val: 'partly_furnished', label: '⚡ Gjysmë' },
]

const SORT_OPTIONS = [
  { val: '',            label: 'Renditje' },
  { val: 'price_asc',  label: 'Çmim ↑' },
  { val: 'price_desc', label: 'Çmim ↓' },
]

export default function FilterSidebar({ filters, onChange, onApply, onReset }) {
  const set = (k, v) => onChange({ ...filters, [k]: v })

  const inputCls = `w-full rounded-lg px-3 py-2 text-sm text-[#e8f4fd]
    border border-white/8 bg-[#0a1929] outline-none
    focus:border-accent/50 focus:ring-2 focus:ring-accent/10
    placeholder:text-muted/50 transition-all`

  const labelCls = 'block text-[11px] font-semibold uppercase tracking-widest text-muted mb-1.5'

  return (
    <aside
      className="rounded-2xl p-5 flex flex-col gap-5 sticky top-20"
      style={{ background: 'rgba(13,31,53,0.75)', border: '1px solid rgba(100,180,255,0.10)', backdropFilter: 'blur(8px)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base text-[#e8f4fd]">🔍 Filtro</h2>
        <button
          onClick={onReset}
          className="text-xs text-muted hover:text-danger transition-colors px-2 py-1 rounded border border-white/5 hover:border-danger/30"
        >
          ↺ Reset
        </button>
      </div>

      {/* Search */}
      <div>
        <label className={labelCls}>Kërko adresë</label>
        <input
          className={inputCls}
          type="text"
          value={filters.q}
          onChange={e => set('q', e.target.value)}
          placeholder="p.sh. Blloku, Kodra…"
        />
      </div>

      {/* Price range */}
      <div>
        <label className={labelCls}>
          Çmimi: €{Number(filters.price_min || 0).toLocaleString()} – €{Number(filters.price_max || 500000).toLocaleString()}
        </label>
        <div className="flex flex-col gap-2">
          <div>
            <span className="text-[10px] text-muted">Min</span>
            <input type="range" min={0} max={500000} step={5000}
              value={filters.price_min || 0}
              onChange={e => {
                const v = Number(e.target.value)
                set('price_min', v >= Number(filters.price_max || 500000) ? Number(filters.price_max || 500000) - 5000 : v)
              }}
            />
          </div>
          <div>
            <span className="text-[10px] text-muted">Max</span>
            <input type="range" min={0} max={500000} step={5000}
              value={filters.price_max || 500000}
              onChange={e => {
                const v = Number(e.target.value)
                set('price_max', v <= Number(filters.price_min || 0) ? Number(filters.price_min || 0) + 5000 : v)
              }}
            />
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <input className={inputCls} type="number" placeholder="Min €" value={filters.price_min}
            onChange={e => set('price_min', e.target.value)} />
          <input className={inputCls} type="number" placeholder="Max €" value={filters.price_max}
            onChange={e => set('price_max', e.target.value)} />
        </div>
      </div>

      {/* SQM range */}
      <div>
        <label className={labelCls}>
          Sipërfaqja: {filters.sqm_min || 30}–{filters.sqm_max || 500} m²
        </label>
        <div className="flex flex-col gap-2">
          <div>
            <span className="text-[10px] text-muted">Min</span>
            <input type="range" min={30} max={500} step={10}
              value={filters.sqm_min || 30}
              onChange={e => {
                const v = Number(e.target.value)
                set('sqm_min', v >= (filters.sqm_max || 500) ? (filters.sqm_max || 500) - 10 : v)
              }}
            />
          </div>
          <div>
            <span className="text-[10px] text-muted">Max</span>
            <input type="range" min={30} max={500} step={10}
              value={filters.sqm_max || 500}
              onChange={e => {
                const v = Number(e.target.value)
                set('sqm_max', v <= (filters.sqm_min || 30) ? (filters.sqm_min || 30) + 10 : v)
              }}
            />
          </div>
        </div>
      </div>

      {/* Beds / Baths */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Dhoma</label>
          <select className={inputCls} value={filters.bedrooms} onChange={e => set('bedrooms', e.target.value)}>
            <option value="">Të gjitha</option>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Banjo</label>
          <select className={inputCls} value={filters.baths} onChange={e => set('baths', e.target.value)}>
            <option value="">Të gjitha</option>
            {[1,2,3,4].map(n => <option key={n} value={n}>{n}+</option>)}
          </select>
        </div>
      </div>

      {/* Furnished toggle */}
      <div>
        <label className={labelCls}>Mobilimi</label>
        <div className="flex flex-col gap-1.5">
          {FURNISHED_OPTIONS.map(o => (
            <button
              key={o.val}
              type="button"
              onClick={() => set('furnished', o.val)}
              className={`text-left text-sm px-3 py-2 rounded-lg border transition-all ${
                filters.furnished === o.val
                  ? 'bg-accent/15 border-accent/40 text-accent'
                  : 'bg-white/3 border-white/5 text-muted hover:border-white/15 hover:text-[#e8f4fd]'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className={labelCls}>Amenitete</label>
        <div className="flex flex-col gap-2">
          {[
            { key: 'elevator', icon: '🛗', label: 'Ashensor' },
            { key: 'parking',  icon: '🅿️', label: 'Parking'  },
            { key: 'garden',   icon: '🌿', label: 'Kopsht'   },
          ].map(a => (
            <label key={a.key} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                  filters[a.key]
                    ? 'bg-accent border-accent'
                    : 'bg-white/5 border-white/15 group-hover:border-accent/40'
                }`}
                onClick={() => set(a.key, !filters[a.key])}
              >
                {filters[a.key] && <span className="text-[10px] text-bg font-bold">✓</span>}
              </div>
              <span className="text-sm text-muted group-hover:text-[#e8f4fd] transition-colors" onClick={() => set(a.key, !filters[a.key])}>
                {a.icon} {a.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className={labelCls}>Rendit sipas</label>
        <select className={inputCls} value={filters.sort} onChange={e => set('sort', e.target.value)}>
          {SORT_OPTIONS.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
        </select>
      </div>

      {/* Apply */}
      <button
        onClick={onApply}
        className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all"
        style={{
          background: 'linear-gradient(135deg, rgba(79,195,247,0.25), rgba(79,195,247,0.1))',
          border: '1px solid rgba(79,195,247,0.35)',
          color: '#4fc3f7',
        }}
        onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(79,195,247,0.38), rgba(79,195,247,0.2)'}
        onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(79,195,247,0.25), rgba(79,195,247,0.1))'}
      >
        ↗ Apliko Filtrat
      </button>
    </aside>
  )
}
