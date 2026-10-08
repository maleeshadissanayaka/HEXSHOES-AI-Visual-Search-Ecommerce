import { useProducts, useWishlist } from "../hooks/useStore";
import ProductGrid from "../components/products/ProductGrid";
import Loader from "../components/shared/Loader";
import EmptyState from "../components/shared/EmptyState";
export default function WishlistPage() {
  const { products, loading, error } = useProducts(),
    wishlist = useWishlist();
  const items = products.filter((p) => wishlist.ids.includes(p.id));
  const missing = wishlist.ids.filter(
    (id) => !products.some((p) => p.id === id),
  );
  return (
    <div className="wrap page">
      <span className="eyebrow">YOUR COLLECTION</span>
      <h1>Saved for later.</h1>
      <p className="page-intro">The styles you keep coming back to.</p>
      {!wishlist.storageAvailable && (
        <p role="status">
          Browser storage is unavailable; saved styles will last only for this
          session.
        </p>
      )}
      {loading ? (
        <Loader />
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <>
          {items.length ? (
            <ProductGrid products={items} />
          ) : (
            <EmptyState
              title="Your wishlist is waiting"
              copy="Save a style with its heart button, and find it here."
            />
          )}
          {missing.map((id) => (
            <div className="unavailable-item" key={id}>
              <span>Saved product {id} is no longer in the catalog.</span>
              <button onClick={() => wishlist.toggle(id)}>Remove</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
