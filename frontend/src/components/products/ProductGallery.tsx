import { useState } from "react";
import type { Product } from "../../types/product";
import { productImage, productName } from "../../utils/product";
import ProductImage from "../shared/ProductImage";
import { sampleProductImages } from "../../data/sampleProductImages";
export default function ProductGallery({ product }: { product: Product }) {
  const images = [
    ...new Set(
      [productImage(product), ...product.images].filter(
        (image): image is string => !!image,
      ),
    ),
  ];
  const [selected, setSelected] = useState(0);
  return (
    <div className="product-gallery">
      <div className="gallery-main">
        <ProductImage
          src={images[selected] ?? null}
          name={productName(product)}
          productId={product.id}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      {!images.length && sampleProductImages[product.id] && (
        <p className="gallery-caption">Sample presentation / {product.id}</p>
      )}
      {images.length > 1 && (
        <div className="gallery-thumbnails">
          {images.map((image, i) => (
            <button
              key={image}
              aria-label={`View ${productName(product)} image ${i + 1}`}
              aria-pressed={i === selected}
              onClick={() => setSelected(i)}
            >
              <img src={image} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
