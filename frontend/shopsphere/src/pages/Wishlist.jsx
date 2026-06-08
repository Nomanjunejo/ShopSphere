import { useEffect, useState } from 'react'
import api from '../services/api'
import MainLayout from '../layouts/MainLayout'
import ProductCard from '../components/ProductCard'

export default function Wishlist() {
  const [items, setItems] = useState([])

  const load = () => api.get('/api/wishlist').then(r => setItems(r.data))
  useEffect(() => { load() }, [])

  const remove = async (pid) => { await api.delete(`/api/wishlist/${pid}`); load() }

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
      {items.length === 0 ? <p>Wishlist is empty.</p> : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(w => (
            <div key={w.id} className="relative">
              <ProductCard product={w.product} />
              <button onClick={() => remove(w.product_id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 hover:bg-red-600">✕</button>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  )
}
