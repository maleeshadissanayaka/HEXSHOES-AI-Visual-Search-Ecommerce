import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useStore";
import { formatPrice } from "../../utils/product";
export default function OrderSummary({
  checkout = false,
}: {
  checkout?: boolean;
}) {
  const { items } = useCart();
  const subtotal =
    items.reduce(
      (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
      0,
    ) / 100;
  const currency = items[0]?.currency ?? null;
  return (
    <aside className="order-summary">
      <h2>Your order</h2>
      <dl>
        <dt>Subtotal</dt>
        <dd>{formatPrice(subtotal, currency)}</dd>
        <dt>Shipping estimate</dt>
        <dd>Pending</dd>
        <dt>Total before shipping</dt>
        <dd>{formatPrice(subtotal, currency)}</dd>
      </dl>
      <p>
        Shipping, taxes and final stock confirmation are not connected. No
        payment will be taken.
      </p>
      {!checkout && items.length > 0 && (
        <Link className="btn btn-solid" to="/checkout">
          DEMO CHECKOUT →
        </Link>
      )}
      <span className="eyebrow">PORTFOLIO CHECKOUT / NO PAYMENT GATEWAY</span>
    </aside>
  );
}
