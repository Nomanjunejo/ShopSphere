import { useEffect, useState } from 'react'
import api from '../../services/api'
import AdminLayout from '../../layouts/AdminLayout'

const STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const load = () => api.get('/api/orders/admin/all').then(r => setOrders(r.data))
  useEffect(() => { load() }, [])

  const updateStatus = async (id, status) => { await api.put(`/api/orders/${id}/status`, { status }); load() }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <table className="w-full bg-white shadow rounded-lg text-sm">
        <thead><tr className="bg-gray-100 text-left">
          <th className="p-3">#</th><th>User</th><th>Total</th><th>Status</th><th>Date</th>
        </tr></thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} className="border-t">
              <td className="p-3">#{o.id}</td>
              <td>{o.user_id}</td>
              <td>${o.total_amount.toFixed(2)}</td>
              <td>
                <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="border rounded px-2 py-1">
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </td>
              <td>{new Date(o.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  )
}
