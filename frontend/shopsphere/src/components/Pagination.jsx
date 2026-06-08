export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null
  return (
    <div className="flex justify-center gap-2 mt-6">
      <button disabled={page === 1} onClick={() => onChange(page - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
      <span className="px-3 py-1">Page {page} of {pages}</span>
      <button disabled={page === pages} onClick={() => onChange(page + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
    </div>
  )
}
