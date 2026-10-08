import type { Product } from "../types/product";
import { API_URL } from "./config";
function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") return false;
  const product = value as Record<string, unknown>;
  const nullableText = (value: unknown) =>
    value === null || typeof value === "string";
  return (
    typeof product.id === "string" &&
    product.id.length > 0 &&
    [
      "code",
      "name",
      "description",
      "currency",
      "category",
      "gender",
      "image",
      "aiImageFilename",
      "createdAt",
    ].every((field) => nullableText(product[field])) &&
    (product.price === null ||
      (typeof product.price === "number" &&
        Number.isFinite(product.price) &&
        product.price >= 0)) &&
    ["images", "colors"].every(
      (field) =>
        Array.isArray(product[field]) &&
        product[field].every((value) => typeof value === "string"),
    ) &&
    Array.isArray(product.availableSizes) &&
    product.availableSizes.every(
      (value) =>
        typeof value === "string" ||
        (typeof value === "number" && Number.isFinite(value)),
    ) &&
    (product.stock === null ||
      (typeof product.stock === "number" &&
        Number.isInteger(product.stock) &&
        product.stock >= 0)) &&
    ["isNew", "featured"].every(
      (field) => product[field] === null || typeof product[field] === "boolean",
    )
  );
}
export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch(`${API_URL}/api/products`, { signal });
  if (!response.ok)
    throw new Error("The product catalog is unavailable. Please try again.");
  const data: unknown = await response.json();
  if (
    !Array.isArray(data) ||
    !data.every(isProduct) ||
    new Set(data.map((product) => product.id)).size !== data.length
  )
    throw new Error("The catalog response was invalid.");
  return data;
}
