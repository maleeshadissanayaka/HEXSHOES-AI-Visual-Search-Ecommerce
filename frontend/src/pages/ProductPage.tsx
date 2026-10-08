import { Link, useParams } from "react-router-dom";
import { useProducts } from "../hooks/useStore";
import ProductGallery from "../components/products/ProductGallery";
import ProductInfo from "../components/products/ProductInfo";
import ProductGrid from "../components/products/ProductGrid";
import Loader from "../components/shared/Loader";
import EmptyState from "../components/shared/EmptyState";
export default function ProductPage() {
  const { id } = useParams(),
    { products, loading, error } = useProducts();
  const product = products.find((p) => p.id === id);
  if (loading) return <Loader />;
  if (error)
    return (
      <div className="wrap page">
        <p role="alert">{error}</p>
      </div>
    );
  if (!product)
    return (
      <EmptyState
        title="Product not found"
        headingLevel={1}
        copy="This style may no longer be available."
      />
    );
  const related = product.category
    ? products
        .filter((p) => p.id !== product.id && p.category === product.category)
        .slice(0, 4)
    : [];
  return (
    <div className="wrap page product-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/shop">Collection</Link>
        <span>/</span>
        <span>{product.name ?? product.id}</span>
      </nav>
      <div className="product-detail-grid">
        <ProductGallery key={`gallery-${product.id}`} product={product} />
        <ProductInfo key={product.id} product={product} />
      </div>
      {related.length > 0 && (
        <section className="related-section">
          <div className="section-heading">
            <h2>RELATED STYLES</h2>
          </div>
          <ProductGrid products={related} />
        </section>
      )}
      <div className="similarity-link">
        <span className="eyebrow">VISUAL DISCOVERY</span>
        <h2>A different way to find your pair.</h2>
        <p>Upload a shoe photo to explore real CLIP-ranked catalog matches.</p>
        <Link className="btn btn-solid" to="/visual-search">
          TRY VISUAL SEARCH
        </Link>
      </div>
    </div>
  );
}
