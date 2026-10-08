import type { Product } from "../types/product";
export const productName = (p: Product) => p.name || "Unnamed product";
export const productImage = (p: Product) => p.image || p.images[0] || null;
export function formatPrice(
  price: number | null,
  currency: string | null,
): string {
  if (price === null) return "Price pending";
  if (!currency) return `${price.toFixed(2)} (currency pending)`;
  try {
    return new Intl.NumberFormat("en", { style: "currency", currency }).format(
      price,
    );
  } catch {
    return `${price.toFixed(2)} ${currency}`;
  }
}
export const displayPrice = (p: Product) => formatPrice(p.price, p.currency);
export const supportsGender = (p: Product, gender: string) =>
  p.gender?.toLowerCase() === gender.toLowerCase() ||
  p.gender?.toLowerCase() === "unisex";
export const matchesSearch = (p: Product, query: string) =>
  [p.name, p.code, p.id, p.category, p.description]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(query.trim().toLowerCase());
export const matchesCategory = (p: Product, category: string) =>
  !category || p.category?.toLowerCase() === category.toLowerCase();
