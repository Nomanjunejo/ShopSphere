import { useEffect, useState } from 'react'
import api from '../../services/api'
import AdminLayout from '../../layouts/AdminLayout'
import Loader from '../../components/Loader'

const Card = ({ label, value, color }) => (
  <div className={`p-5 rounded-lg shadow text-white ${color}`}>
    <p className="text-sm opacity-90">{label}</p>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </div>
)

export default function Dashboard() {
  const [data, setData] = useState(null)
  useEffect(() => { api.get('/api/admin/analytics').then(r => setData(r.data)) }, [])
  if (!data) return <AdminLayout><Loader /></AdminLayout>

  const maxRev = Math.max(...data.monthly_revenue.map(m => m.revenue), 1)

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card label="Users" value={data.total_users} color="bg-indigo-500" />
        <Card label="Products" value={data.total_products} color="bg-green-500" />
        <Card label="Orders" value={data.total_orders} color="bg-yellow-500" />
        <Card label="Revenue" value={`$${data.total_revenue.toFixed(2)}`} color="bg-pink-500" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold mb-4">Monthly Revenue</h2>
          <div className="space-y-2">
            {data.monthly_revenue.map(m => (
              <div key={m.month}>
                <div className="flex justify-between text-sm"><span>{m.month}</span><span>${m.revenue.toFixed(2)}</span></div>
                <div className="bg-gray-200 h-2 rounded">
                  <div className="bg-indigo-500 h-2 rounded" style={{ width: `${(m.revenue / maxRev) * 100}%` }} />
                </div>
              </div>
            ))}
            {data.monthly_revenue.length === 0 && <p className="text-gray-500 text-sm">No revenue data yet.</p>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold mb-4">Top Selling Products</h2>
          {data.top_products.map((p, i) => (
            <div key={i} className="flex justify-between border-b py-2">
              <span>{p.name}</span><span className="font-semibold">{p.sold} sold</span>
            </div>
          ))}
          {data.top_products.length === 0 && <p className="text-gray-500 text-sm">No sales yet.</p>}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h2 className="font-bold mb-4">Recent Orders</h2>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-gray-500"><th>ID</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {data.recent_orders.map(o => (
              <tr key={o.id} className="border-t">
                <td className="py-2">#{o.id}</td>
                <td>${o.total.toFixed(2)}</td>
                <td>{o.status}</td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
