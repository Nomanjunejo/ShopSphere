import { useEffect, useState } from 'react'
import api from '../services/api'
import MainLayout from '../layouts/MainLayout'
import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'
import Loader from '../components/Loader'

export default function Products() {
  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState({ search: '', category_id: '', min_price: '', max_price: '', in_stock: false, page: 1 })

  useEffect(() => { api.get('/api/categories').then(r => setCategories(r.data)) }, [])

  useEffect(() => {
    setLoading(true)
    const params = { ...filters }
    Object.keys(params).forEach(k => { if (params[k] === '' || params[k] === false) delete params[k] })
    api.get('/api/products', { params })
      .then(r => setData(r.data))
      .finally(() => setLoading(false))
  }, [filters])

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <SearchBar onSearch={(q) => setFilters({ ...filters, search: q, page: 1 })} />

      <div className="grid md:grid-cols-4 gap-4 mt-4 bg-white p-4 rounded-lg shadow">
        <select value={filters.category_id} onChange={(e) => setFilters({ ...filters, category_id: e.target.value, page: 1 })}
          className="border rounded px-2 py-2">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="number" placeholder="Min Price" value={filters.min_price}
          onChange={(e) => setFilters({ ...filters, min_price: e.target.value, page: 1 })}
          className="border rounded px-2 py-2" />
        <input type="number" placeholder="Max Price" value={filters.max_price}
          onChange={(e) => setFilters({ ...filters, max_price: e.target.value, page: 1 })}
          className="border rounded px-2 py-2" />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={filters.in_stock}
            onChange={(e) => setFilters({ ...filters, in_stock: e.target.checked, page: 1 })} />
          In stock only
        </label>
      </div>

      {loading ? <Loader /> : (
        <>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {data.items.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          {data.items.length === 0 && <p className="text-center text-gray-500 py-8">No products found.</p>}
          <Pagination page={data.page} pages={data.pages} onChange={(p) => setFilters({ ...filters, page: p })} />
        </>
      )}
    </MainLayout>
  )
}
