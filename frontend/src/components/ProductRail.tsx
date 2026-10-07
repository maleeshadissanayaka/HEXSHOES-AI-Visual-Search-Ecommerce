import { useEffect, useState } from 'react'
import './ProductRail.css'
import ProductCard from './ProductCard'
import type { Product } from '../data/products'

interface ProductRailProps {
  wishlist: Set<string>
  onToggleWishlist: (productId: string) => void
  onAddToCart: (productName: string) => void
}

function ProductRail({ wishlist, onToggleWishlist, onAddToCart }: ProductRailProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('http://localhost:4000/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch products')
        return res.json()
      })
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load products. Is the backend running?')
        setLoading(false)
      })
  }, [])

  return (
    <section className="rail-section" id="rail" data-reveal>
      <div className="wrap">
        <div className="rail-head">
          <h2>New Drops</h2>
          <p>Managed live from the admin dashboard — restock and pricing update instantly.</p>
        </div>

        {loading && <p className="rail-status">Loading products…</p>}
        {error && <p className="rail-status error">{error}</p>}

        <div className="rail" data-reveal-stagger>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlist.has(product.id)}
              onToggleWishlist={() => onToggleWishlist(product.id)}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductRail