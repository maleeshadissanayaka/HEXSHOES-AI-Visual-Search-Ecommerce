import { useEffect, useState } from 'react'
import type { Product } from '../data/products'
import './QuickViewModal.css'

interface QuickViewModalProps {
  product: Product
  image: string
  fullDescription: string
  isWishlisted: boolean
  onToggleWishlist: () => void
  onAddToCart: (productName: string) => void
  onClose: () => void
}

function HeartIcon() {
  return <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 2 5 5.5 5c2 0 3.5 1.2 4.5 2.7C11 6.2 12.5 5 14.5 5 18 5 19.5 8.5 17.5 12.5 15 16.65 12 21 12 21z" /></svg>
}

function QuickViewModal({ product, image, fullDescription, isWishlisted, onToggleWishlist, onAddToCart, onClose }: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState('8')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function addToCart() {
    onAddToCart(product.name)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className="modal-overlay open" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-label={`Quick view: ${product.name}`}>
        <div className="modal-img">
          <img src={image} alt={product.name} />
          <button className="modal-close" type="button" aria-label="Close quick view" onClick={onClose}>✕</button>
        </div>
        <div className="modal-info">
          <div className="tag">{product.tag}</div>
          <h3>{product.name}</h3>
          <div className="size-label description-label">Description</div>
          <div className="desc">{fullDescription || product.desc}</div>
          <span className="price">{product.price}</span>
          <div className="size-label">Select size (UK)</div>
          <div className="size-grid" aria-label="Select shoe size">
            {[6, 7, 8, 9, 10, 11].map((size) => (
              <button className={`size-opt${selectedSize === String(size) ? ' selected' : ''}`} type="button" key={size} aria-pressed={selectedSize === String(size)} onClick={() => setSelectedSize(String(size))}>{size}</button>
            ))}
          </div>
          <div className="modal-actions">
            <button className={`modal-wish${isWishlisted ? ' active' : ''}`} type="button" aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'} aria-pressed={isWishlisted} onClick={onToggleWishlist}><HeartIcon /></button>
            <button className="btn btn-solid" type="button" onClick={addToCart}>{added ? 'Added ✓' : 'Add to Cart'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickViewModal