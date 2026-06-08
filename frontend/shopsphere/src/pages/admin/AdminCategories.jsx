import { useEffect, useState } from 'react'
import api from '../../services/api'
import AdminLayout from '../../layouts/AdminLayout'

export default function AdminCategories() {
  const [cats, setCats] = useState([])
  const [name, setName] = useState('')
  const [editing, setEditing] = useState(null)

  const load = () => api.get('/api/categories').then(r => setCats(r.data))
  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (editing) await api.put(`/api/categories/${editing.id}`, { name })
    else await api.post('/api/categories', { name })
    setName(''); setEditing(null); load()
  }

  const del = async (id) => { if (confirm('Delete?')) { await api.delete(`/api/categories/${id}`); load() } }
  const edit = (c) => { setEditing(c); setName(c.name) }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <form onSubmit={submit} className="flex gap-2 mb-6">
        <input required value={name} onChange={e => setName(e.target.value)} placeholder="Category name" className="border rounded p-2 flex-1" />
        <button className="bg-indigo-600 text-white px-4 rounded">{editing ? 'Update' : 'Add'}</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setName('') }} className="px-3">Cancel</button>}
      </form>
      <div className="bg-white rounded-lg shadow divide-y">
        {cats.map(c => (
          <div key={c.id} className="flex justify-between p-3">
            <span>{c.name}</span>
            <div className="space-x-3">
              <button onClick={() => edit(c)} className="text-indigo-600">Edit</button>
              <button onClick={() => del(c.id)} className="text-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
