import { useState, useEffect, useCallback } from 'react'
import FilterSidebar from '../components/FilterSidebar'
import ListingCard from '../components/ListingCard'
import SkeletonCard from '../components/SkeletonCard'
import Pagination from '../components/Pagination'
import MarketInsightsWidget from '../components/MarketInsightsWidget'
import { fetchListings } from '../api'

const LIMIT = 12

const DEFAULT_FILTERS = {
  q:         '',
  price_min: '',
  price_max: '',
  sqm_min:   30,
  sqm_max:   500,
  bedrooms:  '',
  baths:     '',
  furnished: '',
  elevator:  false,
  parking:   false,
  garden:    false,
  sort:      '',
}

export default function ListingsPage() {
  const [filters,  setFilters]  = useState(DEFAULT_FILTERS)
  const [applied,  setApplied]  = useState(DEFAULT_FILTERS)
  const [items,    setItems]    = useState([])
  const [total,    setTotal]    = useState(0)
  const [page,     setPage]     = useState(1)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  const load = useCallback(async (f, p = 1) => {
    setLoading(true); setError(null)
    try {
      const data = await fetchListings({ ...f, limit: LIMIT, page: p })
      setItems(data.items || [])
      setTotal(data.total ?? (data.items || []).length)
    } catch (e) {
      setError(e.message); setItems([]); setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(DEFAULT_FILTERS, 1) }, [load])

  const handleApply = () => {
    setApplied(filters)
    setPage(1)
    load(filters, 1)
  }

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS)
    setApplied(DEFAULT_FILTERS)
    setPage(1)
    load(DEFAULT_FILTERS, 1)
  }

  const handlePage = (p) => {
    setPage(p)
    load(applied, p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
      {/* ── Hero ────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 text-accent text-xs font-semibold uppercase tracking-widest">
          <span className="w-6 h-px bg-accent" />
          Tregu Imobiliar
        </div>
        <h1 className="font-display text-4xl sm:text-5xl leading-tight mb-3" style={{
          background: 'linear-gradient(135deg, #e8f4fd 30%, #81d4fa 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          Gjej Pronën Tënde<br /><em className="italic" style={{ WebkitTextFillColor: '#ffd54f' }}>Ideale</em> në Tiranë
        </h1>
        <p className="text-muted text-base max-w-lg font-light">
          {total > 0
            ? `${total.toLocaleString()} prona të disponueshme — apartamente, zyra, vila dhe më shumë.`
            : 'Duke ngarkuar pronat…'}
        </p>
      </div>

      {/* ── Layout: sidebar + content ────────────────────────── */}
      <div className="flex gap-6 items-start">
        {/* Sidebar */}
        <div className="hidden lg:block w-72 shrink-0">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onApply={handleApply}
            onReset={handleReset}
          />
          <div className="mt-4">
            <MarketInsightsWidget items={items} />
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Mobile filter + status bar */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <span className="text-sm text-muted">
              {loading
                ? <><span className="inline-block w-1.5 h-1.5 rounded-full bg-accent mr-1.5 animate-pulse-dot" />Duke ngarkuar…</>
                : error
                ? <span className="text-danger">Gabim gjatë ngarkimit</span>
                : `${items.length} nga ${total.toLocaleString()} rezultate`
              }
            </span>
            <div className="flex items-center gap-2">
              <select
                className="text-xs rounded-lg px-2 py-1.5 text-muted outline-none"
                style={{ background: 'rgba(10,25,41,0.9)', border: '1px solid rgba(100,180,255,0.12)', color: '#7eacc4' }}
                value={filters.sort}
                onChange={e => { setFilters(f => ({ ...f, sort: e.target.value })); handleApply() }}
              >
                <option value="">Rendit</option>
                <option value="price_asc">Çmim ↑</option>
                <option value="price_desc">Çmim ↓</option>
              </select>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl p-4 mb-4 text-sm text-danger"
              style={{ background: 'rgba(239,154,154,0.08)', border: '1px solid rgba(239,154,154,0.25)' }}>
              ⚠️ Nuk mund të ngarkohen listat. A është API aktiv?<br />
              <small className="opacity-70">{error}</small>
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: LIMIT }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : !error && items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted">
              <span className="text-5xl mb-4">🏙️</span>
              <p className="text-base">Nuk u gjetën rezultate me këto filtra.</p>
              <button
                onClick={handleReset}
                className="mt-4 text-sm text-accent underline"
              >
                Pastro filtrat
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {items.map((item, i) => (
                <ListingCard key={item.id} item={item} index={i} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination page={page} total={total} limit={LIMIT} onChange={handlePage} />
        </div>
      </div>
    </div>
  )
}
