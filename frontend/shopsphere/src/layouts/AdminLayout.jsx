import { Link, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function AdminLayout({ children }) {
  const { pathname } = useLocation()
  const links = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/products', label: 'Products' },
    { to: '/admin/categories', label: 'Categories' },
    { to: '/admin/orders', label: 'Orders' },
  ]
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <aside className="w-56 bg-white border-r p-4">
          <h2 className="text-xs uppercase text-gray-500 mb-2">Admin</h2>
          <nav className="flex flex-col gap-1">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`px-3 py-2 rounded text-sm ${pathname === l.to ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}>
                {l.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
