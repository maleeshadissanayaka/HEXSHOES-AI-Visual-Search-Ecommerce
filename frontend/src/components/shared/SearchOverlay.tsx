import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import ProductImage from "./ProductImage";
import { useProducts } from "../../hooks/useStore";
import {
  matchesSearch,
  productName,
  productImage,
  displayPrice,
} from "../../utils/product";
export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const { products, loading, error } = useProducts();
  const results = products.filter((p) => matchesSearch(p, query));
  return (
    <Modal title="Search products" onClose={onClose} className="search-modal">
      <span className="eyebrow">FIND YOUR NEXT PAIR</span>
      <h2>Search the collection.</h2>
      <label className="sr-only" htmlFor="global-search">
        Search products
      </label>
      <input
        id="global-search"
        className="search-input"
        type="search"
        placeholder="Search name, code, category..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading ? (
        <p role="status">Loading products...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <>
          <p className="search-count">{results.length} styles</p>
          <div className="search-results">
            {results.map((product) => (
              <Link
                to={`/product/${encodeURIComponent(product.id)}`}
                key={product.id}
                onClick={onClose}
              >
                <ProductImage
                  src={productImage(product)}
                  name={productName(product)}
                />
                <div>
                  <span className="eyebrow">{product.code ?? product.id}</span>
                  <h3>{productName(product)}</h3>
                  <p>{displayPrice(product)}</p>
                </div>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
          {results.length === 0 && <p>No products match this search.</p>}
        </>
      )}
    </Modal>
  );
}
