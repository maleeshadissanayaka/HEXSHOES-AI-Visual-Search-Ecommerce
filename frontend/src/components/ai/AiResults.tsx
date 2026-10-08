import { Link } from "react-router-dom";
import type { VisualMatch } from "../../types/product";
import { useProducts } from "../../hooks/useStore";
import { catalogImage } from "../../services/aiSearch";
import { productName, productImage, displayPrice } from "../../utils/product";
export default function AiResults({ matches }: { matches: VisualMatch[] }) {
  const { products } = useProducts();
  return (
    <div>
      <h3 className="results-title">
        Similar styles <span>Cosine similarity score</span>
      </h3>
      {matches.length === 0 && <p>No catalog matches were returned.</p>}
      <div className="results">
        {matches.map((match, rank) => {
          const product = products.find(
            (p) =>
              !!match.productId &&
              p.id === match.productId &&
              p.aiImageFilename === match.filename,
          );
          return (
            <article className="result-tile" key={match.filename}>
              <span className="rank-badge">0{rank + 1}</span>
              <img
                src={
                  (product && productImage(product)) ||
                  catalogImage(match.filename)
                }
                alt={
                  product
                    ? productName(product)
                    : `Catalog shoe ${match.filename}`
                }
                loading="lazy"
              />
              <span className="match-score">
                {match.score.toFixed(4)} similarity
              </span>
              {product ? (
                <>
                  <span className="result-name">{productName(product)}</span>
                  <span>{displayPrice(product)}</span>
                  <Link
                    className="text-link"
                    to={`/product/${encodeURIComponent(product.id)}`}
                  >
                    View Product
                  </Link>
                </>
              ) : (
                <>
                  <span className="result-name">{match.filename}</span>
                  <span>Catalog reference</span>
                  <span className="mapping-pending">
                    Product mapping pending
                  </span>
                </>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
