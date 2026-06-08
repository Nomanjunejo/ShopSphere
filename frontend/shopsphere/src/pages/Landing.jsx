import { Link } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'

export default function Landing() {
  return (
    <MainLayout>
      <section className="text-center py-20 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl">
        <h1 className="text-5xl font-bold mb-4">Welcome to ShopSphere</h1>
        <p className="text-lg mb-6">Discover amazing products at great prices.</p>
        <Link to="/products" className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
          Shop Now
        </Link>
      </section>
      <section className="grid md:grid-cols-3 gap-6 mt-12">
        {[
          { t: 'Quality Products', d: 'Curated selection from top brands.' },
          { t: 'Fast Shipping', d: 'Delivered in record time.' },
          { t: 'Secure Checkout', d: 'JWT-protected transactions.' },
        ].map(f => (
          <div key={f.t} className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="font-semibold text-lg mb-2">{f.t}</h3>
            <p className="text-gray-600">{f.d}</p>
          </div>
        ))}
      </section>
    </MainLayout>
  )
}
