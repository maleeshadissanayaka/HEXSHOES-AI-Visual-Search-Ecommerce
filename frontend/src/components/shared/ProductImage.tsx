import { useState } from "react";
export default function ProductImage({
  src,
  name,
  className = "",
}: {
  src: string | null;
  name: string;
  className?: string;
}) {
  const [failed, setFailed] = useState<string | null>(null);
  return src && failed !== src ? (
    <img
      className={className}
      src={src}
      alt={name}
      loading="lazy"
      onError={() => setFailed(src)}
    />
  ) : (
    <div className={`product-placeholder ${className}`}>
      <span className="placeholder-mark" aria-hidden="true">
        HX
      </span>
      <span>Product photography pending</span>
    </div>
  );
}
