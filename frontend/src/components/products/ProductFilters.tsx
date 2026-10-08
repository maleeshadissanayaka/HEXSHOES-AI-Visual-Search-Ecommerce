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
    ...new Set([
      "Runners",
      "Trail & Boot",
      "Slides",
      ...products.map((p) => p.category).filter((c): c is string => !!c),
    ]),
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
          value={filters.category}
          onChange={(e) => onChange("category", e.target.value)}
        >
          <option value="">All categories</option>
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
            value={filters.gender}
            onChange={(e) => onChange("gender", e.target.value)}
          >
            <option value="">All genders</option>
            <option>Men</option>
            <option>Women</option>
            <option>Unisex</option>
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
          value={filters.size}
          onChange={(e) => onChange("size", e.target.value)}
        >
          <option value="">All supplied sizes</option>
          {sizes.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </label>
      <label>
        Color
        <select
          aria-label="Color"
          value={filters.color}
          onChange={(e) => onChange("color", e.target.value)}
        >
          <option value="">All supplied colors</option>
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
          <option value="newest">Newest</option>
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
