import { useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/useStore";
import { supportsGender, matchesCategory } from "../../utils/product";
import ProductCard from "../products/ProductCard";
import Loader from "../shared/Loader";
import "./ProductRail.css";
const filters = ["All", "Men", "Women", "Runners", "Trail & Boot", "Slides"];
export default function ProductRail() {
  const [filter, setFilter] = useState("All");
  const { products, loading, error, retry } = useProducts();
  const filtered = products.filter(
    (p) =>
      filter === "All" ||
      (["Men", "Women"].includes(filter)
        ? supportsGender(p, filter)
        : matchesCategory(p, filter)),
  );
  return (
    <section className="rail-section" id="rail" data-reveal>
      <div className="wrap">
        <div className="section-heading">
          <h2>NEW DROPS</h2>
          <div className="home-filters" aria-label="Product categories">
            {filters.map((value) => (
              <button
                key={value}
                aria-pressed={filter === value}
                disabled={
                  value !== "All" &&
                  !products.some((p) =>
                    ["Men", "Women"].includes(value)
                      ? supportsGender(p, value)
                      : matchesCategory(p, value),
                  )
                }
                onClick={() => setFilter(value)}
              >
                {value}
              </button>
            ))}
          </div>
          <Link to="/new-drops">VIEW ALL →</Link>
        </div>
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="rail-status" role="alert">
            {error}
            <button onClick={retry}>Retry</button>
          </div>
        ) : filtered.length ? (
          <div className="rail" data-reveal-stagger>
            {filtered.slice(0, 5).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="rail-status">
            No products have verified {filter.toLowerCase()} metadata yet.
          </p>
        )}
        <p className="catalog-note">
          Explore the current collection. Temporary presentation imagery.
        </p>
      </div>
    </section>
  );
}
