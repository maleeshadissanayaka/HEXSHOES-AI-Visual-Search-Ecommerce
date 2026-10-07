import { useCallback, useState } from 'react';
import type { Product } from '../data/products';
import QuickViewModal from './QuickViewModal';
import Icon from './Icon';
interface ProductCardProps {
    product: Product;
    isWishlisted: boolean;
    onToggleWishlist: () => void;
    onAddToCart: (name: string) => void;
}
export default function ProductCard({ product, isWishlisted, onToggleWishlist, onAddToCart }: ProductCardProps) {
    const [quickViewOpen, setQuickViewOpen] = useState(false);
    const [added, setAdded] = useState(false);
    const close = useCallback(() => setQuickViewOpen(false), []);
    return <><article className="prod-card"><button className={`wish-btn${isWishlisted ? ' active' : ''}`} aria-label={`${isWishlisted ? 'Remove' : 'Add'} ${product.name} ${isWishlisted ? 'from' : 'to'} wishlist`} aria-pressed={isWishlisted} onClick={onToggleWishlist}><Icon name="heart"/></button><div className="prod-img">{product.image ? <img src={product.image} alt={product.name} loading="lazy"/> : <span className="image-unavailable">Product photography coming soon</span>}<button className="qv-btn" onClick={() => setQuickViewOpen(true)}>Quick View</button></div><div className="prod-info"><span className="tag">{product.id}</span><h3>{product.name}</h3><div className="prod-foot"><span className="price">{product.price}</span><button className={`add-circle${added ? ' added' : ''}`} aria-label={`Add ${product.name} to cart`} onClick={() => { onAddToCart(product.name); setAdded(true); window.setTimeout(() => setAdded(false), 1000); }}>{added ? '✓' : '+'}</button></div></div></article>{quickViewOpen && <QuickViewModal product={product} image={product.image ?? ''} fullDescription={product.desc} isWishlisted={isWishlisted} onToggleWishlist={onToggleWishlist} onAddToCart={onAddToCart} onClose={close}/>}</>;
}
