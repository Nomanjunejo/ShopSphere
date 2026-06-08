import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'

export default function Register() {
  const { register } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [err, setErr] = useState('')

  const submit = async (e) => {
    e.preventDefault(); setErr('')
    try { await register(form.name, form.email, form.password); nav('/products') }
    catch (e) { setErr(e.response?.data?.detail || 'Registration failed') }
  }

  return (
    <MainLayout>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        {err && <p className="bg-red-100 text-red-700 p-2 rounded mb-3">{err}</p>}
        <form onSubmit={submit} className="space-y-4">
          <input required placeholder="Name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded px-3 py-2" />
          <input type="email" required placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border rounded px-3 py-2" />
          <input type="password" required placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border rounded px-3 py-2" />
          <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Sign Up</button>
        </form>
        <p className="text-sm mt-4 text-center">
          Have an account? <Link to="/login" className="text-indigo-600">Login</Link>
        </p>
      </div>
    </MainLayout>
  )
}
