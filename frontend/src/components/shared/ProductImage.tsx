import { useState } from "react";
import { sampleProductImages } from "../../data/sampleProductImages";
export default function ProductImage({
  src,
  name,
  className = "",
  productId,
  sizes = "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw",
}: {
  src: string | null;
  name: string;
  className?: string;
  productId?: string;
  sizes?: string;
}) {
  const [failed, setFailed] = useState<string | null>(null);
  const sample = productId ? sampleProductImages[productId] : undefined;
  const displaySrc = src || sample?.src;
  const isSample = !src && !!sample;
  return displaySrc && failed !== displaySrc ? (
    <img
      className={className}
      src={displaySrc}
      srcSet={
        isSample
          ? `${sample.src.replace(".webp", "-500.webp")} 500w, ${sample.src} 1000w`
          : undefined
      }
      sizes={isSample ? sizes : undefined}
      alt={
        isSample
          ? `${name} — sample presentation image, not official product photography`
          : name
      }
      data-sample-image={isSample || undefined}
      loading="lazy"
      onError={() => setFailed(displaySrc)}
    />
  ) : (
    <div className={`product-placeholder ${className}`}>
      <span className="placeholder-mark" aria-hidden="true">
        HX
      </span>
      <span>HEX / Footwear</span>
    </div>
  );
}
