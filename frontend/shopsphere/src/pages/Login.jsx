import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [err, setErr] = useState('')

  const submit = async (e) => {
    e.preventDefault(); setErr('')
    try {
      const u = await login(form.email, form.password)
      nav(u.role === 'admin' ? '/admin' : '/products')
    } catch (e) { setErr(e.response?.data?.detail || 'Login failed') }
  }

  return (
    <MainLayout>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {err && <p className="bg-red-100 text-red-700 p-2 rounded mb-3">{err}</p>}
        <form onSubmit={submit} className="space-y-4">
          <input type="email" required placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border rounded px-3 py-2" />
          <input type="password" required placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border rounded px-3 py-2" />
          <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Login</button>
        </form>
        <p className="text-sm mt-4 text-center">
          No account? <Link to="/register" className="text-indigo-600">Sign up</Link>
        </p>
      </div>
    </MainLayout>
  )
}
