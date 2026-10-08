import { Link } from "react-router-dom";
import { useCart, useProducts } from "../hooks/useStore";
import { formatPrice } from "../utils/product";
import ProductImage from "../components/shared/ProductImage";
import EmptyState from "../components/shared/EmptyState";
import OrderSummary from "../components/products/OrderSummary";
export default function CartPage() {
  const cart = useCart(),
    { products } = useProducts();
  return (
    <div className="wrap page">
      <span className="eyebrow">YOUR NEXT MOVES</span>
      <h1>Your cart.</h1>
      <p className="page-intro">
        {cart.count} {cart.count === 1 ? "item" : "items"} selected. No payment
        is connected.
      </p>
      {!cart.storageAvailable && (
        <p role="status">
          Browser storage is unavailable. Cart changes last only for this
          session.
        </p>
      )}
      {cart.items.length ? (
        <div className="cart-layout">
          <div>
            {cart.items.map((item) => {
              const stock = products.find(
                (p) => p.id === item.productId,
              )?.stock;
              return (
                <article className="cart-line" key={item.key}>
                  <Link to={`/product/${encodeURIComponent(item.productId)}`}>
                    <ProductImage
                      src={item.image}
                      name={item.name}
                      productId={item.productId}
                    />
                  </Link>
                  <div>
                    <Link to={`/product/${encodeURIComponent(item.productId)}`}>
                      <h2>{item.name}</h2>
                    </Link>
                    <p>
                      Size: {item.size ?? "pending"} / Color:{" "}
                      {item.color ?? "pending"}
                    </p>
                    <strong>{formatPrice(item.price, item.currency)}</strong>
                    <div className="quantity-control">
                      <button
                        aria-label={`Decrease ${item.name} quantity`}
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          cart.setQuantity(item.key, item.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span aria-live="polite">{item.quantity}</span>
                      <button
                        aria-label={`Increase ${item.name} quantity`}
                        disabled={
                          item.quantity >= 99 ||
                          (stock !== null &&
                            stock !== undefined &&
                            item.quantity >= stock)
                        }
                        onClick={() =>
                          cart.setQuantity(item.key, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="cart-line-end">
                    <span>
                      {formatPrice(item.price * item.quantity, item.currency)}
                    </span>
                    <button
                      className="text-link"
                      onClick={() => cart.remove(item.key)}
                    >
                      Remove {item.name}
                    </button>
                  </div>
                </article>
              );
            })}
            <button className="text-link" onClick={cart.clear}>
              Clear cart
            </button>
          </div>
          <OrderSummary />
        </div>
      ) : (
        <EmptyState
          title="Room for your next pair"
          copy="Explore the collection and add a style to begin."
        />
      )}
    </div>
  );
}
