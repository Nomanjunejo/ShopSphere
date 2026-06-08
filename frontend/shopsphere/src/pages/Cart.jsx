import { Link, useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import { useCart } from '../context/CartContext'
import { apiBaseUrl } from '../services/api'

export default function Cart() {
  const { items, total, updateQty, removeFromCart } = useCart()
  const nav = useNavigate()

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {items.length === 0 ? (
        <p>Cart is empty. <Link to="/products" className="text-indigo-600">Browse products</Link></p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            {items.map(i => {
              const img = i.product.image_url?.startsWith('http') ? i.product.image_url : `${apiBaseUrl}${i.product.image_url}`
              return (
                <div key={i.id} className="bg-white p-4 rounded-lg shadow flex gap-4 items-center">
                  <img src={img} alt={i.product.name} className="w-20 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{i.product.name}</h3>
                    <p className="text-indigo-600">${i.product.price.toFixed(2)}</p>
                  </div>
                  <input type="number" min="1" value={i.quantity}
                    onChange={(e) => updateQty(i.id, Number(e.target.value))}
                    className="w-16 border rounded px-2 py-1" />
                  <button onClick={() => removeFromCart(i.id)} className="text-red-500">Remove</button>
                </div>
              )
            })}
          </div>
          <div className="bg-white p-6 rounded-lg shadow h-fit">
            <h2 className="text-xl font-bold mb-3">Summary</h2>
            <div className="flex justify-between mb-2"><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
            <div className="flex justify-between mb-4 font-bold border-t pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
            <button onClick={() => nav('/checkout')} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Checkout</button>
          </div>
        </div>
      )}
    </MainLayout>
  )
}
