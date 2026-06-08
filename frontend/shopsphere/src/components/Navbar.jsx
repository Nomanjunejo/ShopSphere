import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const totalItems = items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-black tracking-wider text-indigo-400 hover:opacity-90">
          SHOPSPHERE
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-indigo-400 transition">Products</Link>
          <Link to="/orders" className="hover:text-indigo-400 transition">My Orders</Link>
          <Link to="/cart" className="relative hover:text-indigo-400 transition">
            Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded hover:bg-indigo-500 hover:text-white transition">Admin Panel</Link>
          )}
          {user ? (
            <button onClick={() => logout().then(() => navigate('/login'))} className="text-gray-400 hover:text-red-400 transition">Logout</button>
          ) : (
            <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded font-medium transition">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}