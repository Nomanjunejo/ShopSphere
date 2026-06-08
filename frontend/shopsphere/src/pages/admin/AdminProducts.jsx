import { useEffect, useState } from 'react'
import api from '../../services/api'
import AdminLayout from '../../layouts/AdminLayout'
import Modal from '../../components/Modal'

const blank = { name: '', description: '', price: 0, stock: 0, image_url: '', category_id: '' }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [cats, setCats] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blank)

  const load = () => api.get('/api/products', { params: { limit: 100 } }).then(r => setProducts(r.data.items))
  useEffect(() => { load(); api.get('/api/categories').then(r => setCats(r.data)) }, [])

  const openNew = () => { setEditing(null); setForm(blank); setOpen(true) }
  const openEdit = (p) => { setEditing(p); setForm({ ...p, category_id: p.category_id || '' }); setOpen(true) }

  const uploadImage = async (e) => {
    const file = e.target.files[0]; if (!file) return
    const fd = new FormData(); fd.append('file', file)
    const { data } = await api.post('/api/products/upload-image', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    setForm({ ...form, image_url: data.image_url })
  }

  const save = async (e) => {
    e.preventDefault()
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock), category_id: form.category_id ? Number(form.category_id) : null }
    if (editing) await api.put(`/api/products/${editing.id}`, payload)
    else await api.post('/api/products', payload)
    setOpen(false); load()
  }

  const del = async (id) => { if (confirm('Delete?')) { await api.delete(`/api/products/${id}`); load() } }

  return (
    <AdminLayout>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={openNew} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">+ New</button>
      </div>

      <table className="w-full bg-white rounded-lg shadow text-sm">
        <thead><tr className="text-left bg-gray-100"><th className="p-3">Name</th><th>Price</th><th>Stock</th><th>Category</th><th></th></tr></thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} className="border-t">
              <td className="p-3">{p.name}</td>
              <td>${p.price.toFixed(2)}</td>
              <td>{p.stock} {p.stock < 10 && <span className="text-xs bg-red-100 text-red-700 px-2 ml-1 rounded">Low</span>}</td>
              <td>{p.category?.name}</td>
              <td className="space-x-2 pr-3">
                <button onClick={() => openEdit(p)} className="text-indigo-600">Edit</button>
                <button onClick={() => del(p.id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Product' : 'New Product'}>
        <form onSubmit={save} className="space-y-3">
          <input required placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded p-2" />
          <textarea placeholder="Description" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded p-2" />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" step="0.01" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="border rounded p-2" />
            <input type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="border rounded p-2" />
          </div>
          <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} className="w-full border rounded p-2">
            <option value="">Select Category</option>
            {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input type="file" accept="image/*" onChange={uploadImage} className="w-full" />
          {form.image_url && <p className="text-xs text-gray-500">Image: {form.image_url}</p>}
          <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Save</button>
        </form>
      </Modal>
    </AdminLayout>
  )
}
