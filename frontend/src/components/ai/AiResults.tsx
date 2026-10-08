import { Link } from "react-router-dom";
import type { VisualMatch } from "../../types/product";
import { useProducts } from "../../hooks/useStore";
import { catalogImage } from "../../services/aiSearch";
import { productName } from "../../utils/product";
export default function AiResults({ matches }: { matches: VisualMatch[] }) {
  const { products } = useProducts();
  return (
    <div>
      <h3 className="results-title">
        Similar styles <span>Cosine similarity score</span>
      </h3>
      {matches.length === 0 && <p>No catalog matches were returned.</p>}
      <div className="results">
        {matches.map((match) => {
          const product = products.find(
            (p) =>
              (!!match.productId && p.id === match.productId) ||
              p.aiImageFilename === match.filename,
          );
          return (
            <article className="result-tile" key={match.filename}>
              <img
                src={catalogImage(match.filename)}
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
                <Link
                  className="result-name"
                  to={`/product/${encodeURIComponent(product.id)}`}
                >
                  {productName(product)} →
                </Link>
              ) : (
                <>
                  <span className="result-name">{match.filename}</span>
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
