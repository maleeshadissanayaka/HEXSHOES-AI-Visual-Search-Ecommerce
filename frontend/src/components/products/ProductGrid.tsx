import type { Product } from "../../types/product";
import ProductCard from "./ProductCard";
import EmptyState from "../shared/EmptyState";
export default function ProductGrid({ products }: { products: Product[] }) {
  return products.length ? (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </div>
  ) : (
    <EmptyState
      title="No styles found"
      copy="Try another search or remove a filter. Missing catalog attributes are never guessed."
    />
  );
}
