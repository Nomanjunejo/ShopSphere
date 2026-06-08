import { useState } from 'react'

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState('')
  const submit = (e) => { e.preventDefault(); onSearch(q) }
  return (
    <form onSubmit={submit} className="flex gap-2 w-full">
      <input value={q} onChange={(e) => setQ(e.target.value)}
        placeholder="Search products..."
        className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      <button className="bg-indigo-600 text-white px-4 rounded hover:bg-indigo-700">Search</button>
    </form>
  )
}
