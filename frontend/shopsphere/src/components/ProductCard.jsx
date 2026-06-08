import { Link } from 'react-router-dom';
import { apiBaseUrl } from '../services/api';

export default function ProductCard({ product }) {
  // Handle absolute vs relative backend image paths safely
  const img = product.image_url?.startsWith('http')
    ? product.image_url
    : `${apiBaseUrl}${product.image_url || ''}`;

  return (
    <Link to={`/products/${product.id}`} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden block">
      <img src={img} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 truncate">{product.category?.name}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-indigo-600 font-bold">${product.price?.toFixed(2)}</span>
          
          {product.stock < 10 && product.stock > 0 && (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Low stock</span>
          )}
          {product.stock === 0 && (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Out of stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}