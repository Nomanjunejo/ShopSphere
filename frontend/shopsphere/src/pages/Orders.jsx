import { useEffect, useState } from 'react';
import api from '../services/api';
import MainLayout from '../layouts/MainLayout';

const statusColor = (s) => ({
  Pending: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
}[s] || 'bg-gray-100 text-gray-700');

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/orders')
      .then(r => {
        setOrders(r.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, []);

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6 text-white">My Orders</h1>
      {loading ? (
        <p className="text-gray-400">Loading your orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-400">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="bg-white rounded-lg shadow p-4 text-gray-800">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">Order #{o.id}</p>
                  <p className="text-sm text-gray-500">{new Date(o.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-medium ${statusColor(o.status)}`}>
                  {o.status}
                </span>
              </div>
              <div className="mt-3 border-t pt-3 space-y-1">
                {o.items?.map(it => (
                  <div key={it.id} className="flex justify-between text-sm text-gray-600">
                    <span>{it.product?.name} × {it.quantity}</span>
                    <span>${(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="text-right font-bold mt-2 text-xl border-t pt-2">
                Total: ${o.total_amount?.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}