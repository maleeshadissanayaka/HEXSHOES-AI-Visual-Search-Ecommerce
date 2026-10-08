import { useState } from "react";
import { useCart } from "../hooks/useStore";
import OrderSummary from "../components/products/OrderSummary";
import EmptyState from "../components/shared/EmptyState";
export default function CheckoutPage() {
  const { items } = useCart(),
    [review, setReview] = useState(false);
  if (!items.length)
    return (
      <EmptyState
        title="Your cart is empty"
        copy="Add a style before reviewing checkout."
      />
    );
  return (
    <div className="wrap page">
      <span className="eyebrow">PORTFOLIO / DEMO CHECKOUT</span>
      <h1>The next step.</h1>
      <p className="page-intro">
        Payment integration is not connected. Use sample details only. No order,
        address or payment is stored.
      </p>
      <div className="cart-layout">
        <form
          className="checkout-form"
          onSubmit={(e) => {
            e.preventDefault();
            setReview(true);
          }}
        >
          <h2>Customer details</h2>
          <label>
            Full name
            <input name="name" autoComplete="name" required maxLength={100} />
          </label>
          <div className="form-row">
            <label>
              Email
              <input type="email" name="email" autoComplete="email" required />
            </label>
            <label>
              Phone
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                minLength={7}
                maxLength={30}
                required
              />
            </label>
          </div>
          <h2>Shipping address</h2>
          <label>
            Address
            <input
              name="address"
              autoComplete="street-address"
              required
              maxLength={200}
            />
          </label>
          <div className="form-row">
            <label>
              City
              <input name="city" autoComplete="address-level2" required />
            </label>
            <label>
              Postal code
              <input name="postal" autoComplete="postal-code" required />
            </label>
          </div>
          <label>
            Country
            <input name="country" autoComplete="country-name" required />
          </label>
          <h2>Order review</h2>
          <ul className="checkout-items">
            {items.map((item) => (
              <li key={item.key}>
                <strong>
                  {item.name} × {item.quantity}
                </strong>
                <span>
                  Size: {item.size ?? "pending"} / Color:{" "}
                  {item.color ?? "pending"}
                </span>
              </li>
            ))}
          </ul>
          <button type="submit" className="btn btn-solid">
            REVIEW DEMO CHECKOUT
          </button>
          {review && (
            <p role="status" className="form-notice">
              Demo review complete. No order has been placed, no details were
              saved, and no payment was processed.
            </p>
          )}
        </form>
        <OrderSummary checkout />
      </div>
    </div>
  );
}
