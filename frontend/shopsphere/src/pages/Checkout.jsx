import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import api from '../services/api'
import MainLayout from '../layouts/MainLayout'
import { useCart } from '../context/CartContext'

export default function Checkout() {
  const { items, total, fetchCart } = useCart()
  const nav = useNavigate()
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const placeOrder = async () => {
    setLoading(true); setErr('')
    try {
      await api.post('/api/orders')
      await fetchCart()
      nav('/orders')
    } catch (e) { setErr(e.response?.data?.detail || 'Order failed') }
    finally { setLoading(false) }
  }

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {items.map(i => (
          <div key={i.id} className="flex justify-between py-2 border-b">
            <span>{i.product.name} × {i.quantity}</span>
            <span>${(i.product.price * i.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-lg pt-4">
          <span>Total</span><span>${total.toFixed(2)}</span>
        </div>
        {err && <p className="text-red-600 mt-2">{err}</p>}
        <button disabled={loading || items.length === 0} onClick={placeOrder}
          className="w-full bg-indigo-600 text-white py-3 rounded mt-6 hover:bg-indigo-700 disabled:opacity-50">
          {loading ? 'Placing...' : 'Place Order'}
        </button>
      </div>
    </MainLayout>
  )
}
