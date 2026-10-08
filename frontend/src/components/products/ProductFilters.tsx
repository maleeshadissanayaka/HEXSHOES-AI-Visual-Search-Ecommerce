import type { Product } from "../../types/product";
export interface Filters {
  query: string;
  category: string;
  gender: string;
  min: string;
  max: string;
  size: string;
  color: string;
  sort: string;
}
export default function ProductFilters({
  products,
  filters,
  onChange,
  onClear,
  lockedGender = false,
}: {
  products: Product[];
  filters: Filters;
  onChange: (key: keyof Filters, value: string) => void;
  onClear: () => void;
  lockedGender?: boolean;
}) {
  const sizes = [
    ...new Set(products.flatMap((p) => p.availableSizes.map(String))),
  ];
  const colors = [...new Set(products.flatMap((p) => p.colors))];
  const categories = [
    ...new Set(products.map((p) => p.category).filter((c): c is string => !!c)),
  ];
  const genders = [
    ...new Set(products.map((p) => p.gender).filter((g): g is string => !!g)),
  ];
  return (
    <div className="product-filters">
      <label>
        Search
        <input
          type="search"
          placeholder="Name, code, description"
          value={filters.query}
          onChange={(e) => onChange("query", e.target.value)}
        />
      </label>
      <label>
        Category
        <select
          aria-label="Category"
          disabled={!categories.length}
          value={filters.category}
          onChange={(e) => onChange("category", e.target.value)}
        >
          <option value="">
            {categories.length ? "All categories" : "Category data pending"}
          </option>
          {categories.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </label>
      {!lockedGender && (
        <label>
          Gender
          <select
            aria-label="Gender"
            disabled={!genders.length}
            value={filters.gender}
            onChange={(e) => onChange("gender", e.target.value)}
          >
            <option value="">
              {genders.length ? "All genders" : "Gender data pending"}
            </option>
            {genders.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
      )}
      <fieldset>
        <legend>Price range</legend>
        <div className="price-fields">
          <label>
            <span className="sr-only">Minimum price</span>
            <input
              aria-label="Minimum price"
              type="number"
              min="0"
              placeholder="Min"
              value={filters.min}
              onChange={(e) => onChange("min", e.target.value)}
            />
          </label>
          <label>
            <span className="sr-only">Maximum price</span>
            <input
              aria-label="Maximum price"
              type="number"
              min="0"
              placeholder="Max"
              value={filters.max}
              onChange={(e) => onChange("max", e.target.value)}
            />
          </label>
        </div>
      </fieldset>
      <label>
        Size
        <select
          aria-label="Size"
          disabled={!sizes.length}
          value={filters.size}
          onChange={(e) => onChange("size", e.target.value)}
        >
          <option value="">
            {sizes.length ? "All supplied sizes" : "Size data pending"}
          </option>
          {sizes.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </label>
      <label>
        Color
        <select
          aria-label="Color"
          disabled={!colors.length}
          value={filters.color}
          onChange={(e) => onChange("color", e.target.value)}
        >
          <option value="">
            {colors.length ? "All supplied colors" : "Color data pending"}
          </option>
          {colors.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </label>
      <label>
        Sort by
        <select
          aria-label="Sort by"
          value={filters.sort}
          onChange={(e) => onChange("sort", e.target.value)}
        >
          <option value="newest">
            {products.some((p) => p.createdAt) ? "Newest" : "Catalog order"}
          </option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </label>
      <button className="text-link" type="button" onClick={onClear}>
        Clear filters
      </button>
      <p className="filter-note">
        Filters use verified catalog attributes. Products with missing
        attributes are excluded only when that filter is selected. Prices use
        the stored currency.
      </p>
    </div>
  );
}
