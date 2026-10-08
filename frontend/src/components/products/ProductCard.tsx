import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../types/product";
import { useCart, useWishlist } from "../../hooks/useStore";
import { productName, productImage, displayPrice } from "../../utils/product";
import ProductImage from "../shared/ProductImage";
import Icon from "../shared/Icon";
import QuickViewModal from "./QuickViewModal";
export default function ProductCard({ product }: { product: Product }) {
  const [quick, setQuick] = useState(false),
    [notice, setNotice] = useState("");
  const close = useCallback(() => setQuick(false), []);
  const wishlist = useWishlist(),
    cart = useCart(),
    name = productName(product),
    wished = wishlist.ids.includes(product.id);
  function add() {
    if (product.availableSizes.length || product.colors.length) {
      setQuick(true);
      return;
    }
    const error = cart.add(product, null, null, 1);
    setNotice(error ?? "Added");
    window.setTimeout(() => setNotice(""), 2000);
  }
  return (
    <>
      <article className="prod-card">
        <button
          className={`wish-btn${wished ? " active" : ""}`}
          type="button"
          aria-label={`${wished ? "Remove" : "Add"} ${name} ${wished ? "from" : "to"} wishlist`}
          aria-pressed={wished}
          onClick={() => wishlist.toggle(product.id)}
        >
          <Icon name="heart" />
        </button>
        {product.isNew === true && <span className="product-badge">NEW</span>}
        <div className="prod-img">
          <Link
            to={`/product/${encodeURIComponent(product.id)}`}
            aria-label={`View ${name}`}
          >
            <ProductImage
              src={productImage(product)}
              name={name}
              productId={product.id}
            />
          </Link>
          <button
            className="qv-btn"
            type="button"
            onClick={() => setQuick(true)}
          >
            Quick View
          </button>
        </div>
        <div className="prod-info">
          <span className="tag">{product.code ?? product.id}</span>
          <h3>
            <Link to={`/product/${encodeURIComponent(product.id)}`}>
              {name}
            </Link>
          </h3>
          <div className="prod-foot">
            <span className="price">{displayPrice(product)}</span>
            <button
              className="add-circle"
              type="button"
              aria-label={`Add ${name} to cart`}
              disabled={
                product.stock === 0 ||
                product.price === null ||
                !product.currency
              }
              onClick={add}
            >
              {notice === "Added" ? <Icon name="bag" /> : "+"}
            </button>
          </div>
          {product.colors.length > 0 && (
            <div className="color-labels">
              {product.colors.slice(0, 3).join(" / ")}
            </div>
          )}
          <span className="sr-only" role="status">
            {notice}
          </span>
        </div>
      </article>
      {quick && <QuickViewModal product={product} onClose={close} />}
    </>
  );
}
