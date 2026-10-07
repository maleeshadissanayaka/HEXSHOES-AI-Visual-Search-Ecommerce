import { useCallback, useEffect, useRef, useState } from 'react'
import type { Product } from '../data/products'
import QuickViewModal from './QuickViewModal'

interface ProductCardProps {
  product: Product
  isWishlisted: boolean
  onToggleWishlist: () => void
  onAddToCart: (productName: string) => void
}

const productDetails: Record<string, { image: string; fullDescription: string; isNew?: boolean }> = {
  'HX-01A': { image: 'https://images.pexels.com/photos/18212364/pexels-photo-18212364.jpeg?auto=compress&cs=tinysrgb&w=600', fullDescription: 'A low-profile everyday runner built on a lightweight foam sole for all-day comfort. Matte canvas upper, breathable mesh lining, and a grippy rubber outsole for reliable traction on city streets.', isNew: true },
  'HX-02F': { image: 'https://images.pexels.com/photos/29573336/pexels-photo-29573336.jpeg?auto=compress&cs=tinysrgb&w=600', fullDescription: 'Built for rougher terrain, the Hex Trail pairs a high-ankle silhouette with a durable ripstop panel that resists tearing on rocky trails. Reinforced toe cap and an aggressive tread pattern for extra grip.' },
  'HX-03C': { image: 'https://images.pexels.com/photos/12628401/pexels-photo-12628401.jpeg?auto=compress&cs=tinysrgb&w=600', fullDescription: 'An easy slip-on slide with a single minimal strap and a contoured cork footbed that softens with wear. Lightweight, water-friendly, and ideal for post-run recovery or lazy weekends.', isNew: true },
  'HX-04E': { image: 'https://images.pexels.com/photos/9853355/pexels-photo-9853355.jpeg?auto=compress&cs=tinysrgb&w=600', fullDescription: 'A sock-fit knit upper that hugs the foot for a seamless, tonal look. Stretch collar for easy on-off, cushioned midsole, and a minimal outsole that keeps the profile clean and modern.' },
}

function HeartIcon() {
  return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 2 5 5.5 5c2 0 3.5 1.2 4.5 2.7C11 6.2 12.5 5 14.5 5 18 5 19.5 8.5 17.5 12.5 15 16.65 12 21 12 21z" /></svg>
}

function ProductCard({ product, isWishlisted, onToggleWishlist, onAddToCart }: ProductCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [added, setAdded] = useState(false)
  const details = productDetails[product.id] ?? productDetails['HX-01A']
  const closeQuickView = useCallback(() => setQuickViewOpen(false), [])

  useEffect(() => {
    const card = cardRef.current
    if (!card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const handleMove = (event: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`
    }
    const handleLeave = () => { card.style.transform = '' }
    card.addEventListener('mousemove', handleMove)
    card.addEventListener('mouseleave', handleLeave)
    return () => {
      card.removeEventListener('mousemove', handleMove)
      card.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  function addToCart() {
    onAddToCart(product.name)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 900)
  }

  return (
    <>
      <article className="prod-card" ref={cardRef}>
        {details.isNew && <span className="prod-badge">New</span>}
        <button className={`wish-btn${isWishlisted ? ' active' : ''}`} type="button" aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`} aria-pressed={isWishlisted} onClick={onToggleWishlist}><HeartIcon /></button>
        <div className="prod-img">
          <img src={details.image} alt={product.name} loading="lazy" />
          <button className="qv-btn" type="button" onClick={() => setQuickViewOpen(true)}>Quick View</button>
        </div>
        <div className="prod-info">
          <div className="tag">{product.tag}</div>
          <h3>{product.name}</h3>
          <div className="desc">{product.desc}</div>
          <div className="prod-foot">
            <span className="price">{product.price}</span>
            <button className={`add-circle${added ? ' added' : ''}`} type="button" aria-label={`Add ${product.name} to cart`} onClick={addToCart}>{added ? '✓' : '+'}</button>
          </div>
        </div>
      </article>
      {quickViewOpen && (
        <QuickViewModal
          product={product}
          image={details.image}
          fullDescription={details.fullDescription}
          isWishlisted={isWishlisted}
          onToggleWishlist={onToggleWishlist}
          onAddToCart={onAddToCart}
          onClose={closeQuickView}
        />
      )}
    </>
  )
}

export default ProductCard