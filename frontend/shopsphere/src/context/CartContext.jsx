import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const CartContext = createContext()
export const useCart = () => useContext(CartContext)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])

  const fetchCart = useCallback(async () => {
    if (!user) return setItems([])
    const { data } = await api.get('/api/cart')
    setItems(data)
  }, [user])

  useEffect(() => { fetchCart() }, [fetchCart])

  const addToCart = async (productId, quantity = 1) => {
    await api.post('/api/cart', { product_id: productId, quantity })
    fetchCart()
  }
  const updateQty = async (itemId, quantity) => {
    await api.put(`/api/cart/${itemId}`, { quantity }); fetchCart()
  }
  const removeFromCart = async (itemId) => {
    await api.delete(`/api/cart/${itemId}`); fetchCart()
  }

  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, total, addToCart, updateQty, removeFromCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}
