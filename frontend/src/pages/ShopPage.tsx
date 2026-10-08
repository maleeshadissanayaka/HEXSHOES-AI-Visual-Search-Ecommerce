import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useStore";
import {
  matchesSearch,
  matchesCategory,
  supportsGender,
} from "../utils/product";
import ProductGrid from "../components/products/ProductGrid";
import ProductFilters, {
  type Filters,
} from "../components/products/ProductFilters";
import Loader from "../components/shared/Loader";
import Modal from "../components/shared/Modal";
export default function ShopPage({
  gender = "",
  newDrops = false,
}: {
  gender?: string;
  newDrops?: boolean;
}) {
  const { products, loading, error, retry } = useProducts(),
    [params, setParams] = useSearchParams();
  const [drawer, setDrawer] = useState(false),
    close = useCallback(() => setDrawer(false), [setDrawer]);
  const [referenceTime] = useState(() => Date.now());
  const filters: Filters = {
    query: params.get("q") ?? "",
    category: params.get("category") ?? "",
    gender: gender || params.get("gender") || "",
    min: params.get("min") ?? "",
    max: params.get("max") ?? "",
    size: params.get("size") ?? "",
    color: params.get("color") ?? "",
    sort: params.get("sort") ?? "newest",
  };
  function change(key: keyof Filters, value: string) {
    const next = new URLSearchParams(params);
    const queryKey = key === "query" ? "q" : key;
    if (value) next.set(queryKey, value);
    else next.delete(queryKey);
    setParams(next, { replace: true });
  }
  const hasNewMetadata = products.some(
    (p) => p.isNew !== null || p.createdAt !== null,
  );
  const recentRelease = (date: string | null) => {
    if (!date) return false;
    const age = referenceTime - Date.parse(date);
    return age >= 0 && age <= 30 * 24 * 60 * 60 * 1000;
  };
  const filtered = products
    .filter(
      (p) =>
        (!newDrops ||
          !hasNewMetadata ||
          p.isNew === true ||
          (p.isNew === null && recentRelease(p.createdAt))) &&
        matchesSearch(p, filters.query) &&
        matchesCategory(p, filters.category) &&
        (!filters.gender || supportsGender(p, filters.gender)) &&
        (!filters.min ||
          (p.price !== null && p.price >= Number(filters.min))) &&
        (!filters.max ||
          (p.price !== null && p.price <= Number(filters.max))) &&
        (!filters.size ||
          p.availableSizes.map(String).includes(filters.size)) &&
        (!filters.color || p.colors.includes(filters.color)),
    )
    .sort((a, b) => {
      if (filters.sort === "price-asc")
        return (a.price ?? Infinity) - (b.price ?? Infinity);
      if (filters.sort === "price-desc")
        return (b.price ?? -Infinity) - (a.price ?? -Infinity);
      return (
        Date.parse(b.createdAt ?? "1970-01-01") -
        Date.parse(a.createdAt ?? "1970-01-01")
      );
    });
  const title = gender
    ? `${gender}. In motion.`
    : newDrops
      ? "New drops. Next moves."
      : "Find your everyday.";
  const filterProps = {
    products,
    filters,
    onChange: change,
    onClear: () => setParams({}),
    lockedGender: !!gender,
  };
  return (
    <div className="shop-page">
      <header className="collection-hero">
        <img
          src={gender ? "/editorial/hero-grid.webp" : "/editorial/trail.webp"}
          alt=""
        />
        <div className="wrap">
          <span className="eyebrow">
            {gender
              ? `${gender.toUpperCase()} COLLECTION`
              : newDrops
                ? "LATEST COLLECTION"
                : "THE COLLECTION"}
          </span>
          <h1>{title}</h1>
          <p>
            Performance, considered design, and a smarter way to discover your
            next pair.
          </p>
        </div>
      </header>
      <div className="wrap shop-content">
        <div className="shop-toolbar">
          <p>
            {loading ? "Loading collection..." : `${filtered.length} products`}
          </p>
          <button className="btn filter-toggle" onClick={() => setDrawer(true)}>
            FILTER & SORT
          </button>
        </div>
        {newDrops && !hasNewMetadata && (
          <p className="inline-notice">
            Showing the current collection. New-drop flags and release dates are
            pending in the catalog.
          </p>
        )}
        <div className="shop-layout">
          <aside className="desktop-filters" aria-label="Product filters">
            <ProductFilters {...filterProps} />
          </aside>
          <div>
            {loading ? (
              <Loader />
            ) : error ? (
              <div role="alert" className="empty-state">
                <p>{error}</p>
                <button className="btn btn-solid" onClick={retry}>
                  Retry catalog
                </button>
              </div>
            ) : (
              <ProductGrid products={filtered} />
            )}
          </div>
        </div>
      </div>
      {drawer && (
        <Modal title="Filter products" onClose={close} className="filter-modal">
          <h2>Filter & sort</h2>
          <ProductFilters {...filterProps} />
          <button className="btn btn-solid" onClick={close}>
            SHOW {filtered.length} PRODUCTS
          </button>
        </Modal>
      )}
    </div>
  );
}
