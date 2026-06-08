import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api, { apiBaseUrl } from '../services/api'
import MainLayout from '../layouts/MainLayout'
import Loader from '../components/Loader'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function ProductDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })
  const [msg, setMsg] = useState('')

  const load = () => {
    api.get(`/api/products/${id}`).then(r => setProduct(r.data))
    api.get(`/api/reviews/product/${id}`).then(r => setReviews(r.data))
  }
  useEffect(() => { load() }, [id])

  const handleAdd = async () => {
    try { await addToCart(product.id); setMsg('Added to cart!') }
    catch { setMsg('Please login first') }
  }

  const addToWishlist = async () => {
    try { await api.post('/api/wishlist', { product_id: product.id }); setMsg('Added to wishlist!') }
    catch { setMsg('Please login first') }
  }

  const submitReview = async (e) => {
    e.preventDefault()
    await api.post('/api/reviews', { product_id: Number(id), ...newReview })
    setNewReview({ rating: 5, comment: '' })
    load()
  }

  const deleteReview = async (rid) => { await api.delete(`/api/reviews/${rid}`); load() }

  if (!product) return <MainLayout><Loader /></MainLayout>

  const img = product.image_url?.startsWith('http') ? product.image_url : `${apiBaseUrl}${product.image_url}`

  return (
    <MainLayout>
      <div className="bg-white rounded-lg shadow p-6 grid md:grid-cols-2 gap-8">
        <img src={img} alt={product.name} className="rounded-lg w-full" />
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-500">{product.category?.name}</p>
          <p className="mt-4 text-2xl text-indigo-600 font-bold">${product.price.toFixed(2)}</p>
          <p className="mt-4 text-gray-700">{product.description}</p>
          <p className="mt-2 text-sm">Stock: <span className={product.stock < 10 ? 'text-red-600 font-semibold' : ''}>{product.stock}</span></p>
          {msg && <p className="mt-2 text-green-600 text-sm">{msg}</p>}
          <div className="flex gap-3 mt-4">
            <button disabled={product.stock === 0} onClick={handleAdd}
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50">
              Add to Cart
            </button>
            <button onClick={addToWishlist} className="border px-6 py-2 rounded hover:bg-gray-100">♥ Wishlist</button>
          </div>
        </div>
      </div>

      <section className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Reviews ({reviews.length})</h2>
        {user && (
          <form onSubmit={submitReview} className="mb-6 border-b pb-4">
            <div className="flex gap-2 items-center mb-2">
              <label>Rating:</label>
              <select value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                className="border rounded px-2 py-1">
                {[5,4,3,2,1].map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
            <textarea value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Write a review..." className="w-full border rounded p-2" rows="3" />
            <button className="bg-indigo-600 text-white px-4 py-2 rounded mt-2 hover:bg-indigo-700">Submit Review</button>
          </form>
        )}
        {reviews.map(r => (
          <div key={r.id} className="border-b py-3">
            <div className="flex justify-between">
              <div>
                <span className="font-semibold">{r.user_name}</span>
                <span className="ml-2 text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              </div>
              {user?.id === r.user_id && (
                <button onClick={() => deleteReview(r.id)} className="text-red-500 text-sm">Delete</button>
              )}
            </div>
            <p className="text-gray-700 mt-1">{r.comment}</p>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
      </section>
    </MainLayout>
  )
}
