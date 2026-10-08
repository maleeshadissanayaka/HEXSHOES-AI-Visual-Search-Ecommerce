import { useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { useCart, useWishlist } from "../../hooks/useStore";
import { displayPrice, productName } from "../../utils/product";
import SizeSelector from "./SizeSelector";
import Icon from "../shared/Icon";
export default function ProductInfo({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState("");
  const cart = useCart(),
    wishlist = useWishlist();
  const name = productName(product);
  return (
    <div className="product-information">
      <span className="eyebrow">{product.code ?? product.id}</span>
      <h1>{name}</h1>
      <p className="detail-price">{displayPrice(product)}</p>
      <p className="product-description">
        {product.description ?? "Product description pending."}
      </p>
      <SizeSelector
        product={product}
        size={size}
        color={color}
        onSize={setSize}
        onColor={setColor}
      />
      <p className="stock-label">
        {product.stock === null
          ? "Stock availability pending"
          : product.stock === 0
            ? "Out of stock"
            : `${product.stock} available`}
      </p>
      <div className="purchase-row">
        <label>
          Quantity
          <input
            type="number"
            min="1"
            max={product.stock ?? 99}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </label>
        <button
          className="btn btn-solid"
          disabled={
            product.stock === 0 || product.price === null || !product.currency
          }
          onClick={() => {
            const error = cart.add(product, size, color, quantity);
            setNotice(error ?? "Added to your cart.");
          }}
        >
          ADD TO CART <Icon name="bag" />
        </button>
        <button
          className="icon-button"
          aria-label={
            wishlist.ids.includes(product.id)
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          aria-pressed={wishlist.ids.includes(product.id)}
          onClick={() => wishlist.toggle(product.id)}
        >
          <Icon name="heart" />
        </button>
      </div>
      <p className="inline-notice" role="status">
        {notice}
      </p>
      {compact ? (
        <Link
          className="text-link"
          to={`/product/${encodeURIComponent(product.id)}`}
        >
          View full details
        </Link>
      ) : (
        <div className="product-disclosures">
          <details>
            <summary>Shipping & returns</summary>
            <p>
              Worldwide shipping and a 30-day return window are planned.
              Eligibility and delivery estimates will be confirmed before live
              checkout launches.
            </p>
          </details>
          <details>
            <summary>Product details</summary>
            <dl>
              <dt>Code</dt>
              <dd>{product.code ?? product.id}</dd>
              <dt>Category</dt>
              <dd>{product.category ?? "Not supplied"}</dd>
              <dt>Gender</dt>
              <dd>{product.gender ?? "Not supplied"}</dd>
            </dl>
          </details>
        </div>
      )}
    </div>
  );
}
