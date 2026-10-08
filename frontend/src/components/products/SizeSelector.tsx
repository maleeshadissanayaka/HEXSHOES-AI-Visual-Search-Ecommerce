import type { Product } from "../../types/product";
export default function SizeSelector({
  product,
  size,
  color,
  onSize,
  onColor,
}: {
  product: Product;
  size: string | null;
  color: string | null;
  onSize: (value: string) => void;
  onColor: (value: string) => void;
}) {
  return (
    <div className="product-options">
      <fieldset>
        <legend>Size</legend>
        {product.availableSizes.length ? (
          <div className="option-list">
            {product.availableSizes.map((value) => (
              <button
                type="button"
                key={String(value)}
                aria-pressed={size === String(value)}
                onClick={() => onSize(String(value))}
              >
                {value}
              </button>
            ))}
          </div>
        ) : (
          <p>Size availability pending</p>
        )}
      </fieldset>
      <fieldset>
        <legend>Color</legend>
        {product.colors.length ? (
          <div className="option-list">
            {product.colors.map((value) => (
              <button
                type="button"
                key={value}
                aria-pressed={color === value}
                onClick={() => onColor(value)}
              >
                {value}
              </button>
            ))}
          </div>
        ) : (
          <p>Color details pending</p>
        )}
      </fieldset>
    </div>
  );
}
