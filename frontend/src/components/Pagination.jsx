export default function Pagination({ page, count, pageSize, onChange }) {
  const pages = Math.max(1, Math.ceil(count / pageSize))
  if (pages <= 1) return null
  return (
    <div className="flex items-center justify-between gap-3 pt-4 text-sm text-muted">
      <span>
        Page {page} of {pages} · {count} total
      </span>
      <div className="flex gap-2">
        <button type="button" className="btn-ghost btn-sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          ← Prev
        </button>
        <button type="button" className="btn-ghost btn-sm" disabled={page >= pages} onClick={() => onChange(page + 1)}>
          Next →
        </button>
      </div>
    </div>
  )
}
