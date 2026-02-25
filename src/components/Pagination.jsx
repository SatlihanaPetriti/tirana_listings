export default function Pagination({ page, total, limit, onChange }) {
  const totalPages = Math.ceil(total / limit)
  if (totalPages <= 1) return null

  const pages = []
  const delta = 2
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…')
    }
  }

  const btnCls = (active) =>
    `w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
      active
        ? 'text-accent'
        : 'text-muted hover:text-[#e8f4fd] hover:bg-white/5'
    }`

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="px-3 h-9 rounded-lg text-sm font-medium text-muted hover:text-[#e8f4fd] disabled:opacity-30 transition-all"
        style={{ border: '1px solid rgba(100,180,255,0.10)' }}
      >
        ← Para
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="w-9 h-9 flex items-center justify-center text-muted text-sm">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={btnCls(p === page)}
            style={{
              border: p === page ? '1px solid rgba(79,195,247,0.35)' : '1px solid rgba(100,180,255,0.10)',
              background: p === page ? 'rgba(79,195,247,0.12)' : 'transparent',
            }}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 h-9 rounded-lg text-sm font-medium text-muted hover:text-[#e8f4fd] disabled:opacity-30 transition-all"
        style={{ border: '1px solid rgba(100,180,255,0.10)' }}
      >
        Tjetër →
      </button>
    </div>
  )
}
