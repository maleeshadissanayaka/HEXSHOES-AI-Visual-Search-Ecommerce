import type { Product } from "../types/product";
import { API_URL } from "./config";
export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch(`${API_URL}/api/products`, { signal });
  if (!response.ok)
    throw new Error("The product catalog is unavailable. Please try again.");
  const data: unknown = await response.json();
  if (!Array.isArray(data) || !data.every((p) => p && typeof p.id === "string"))
    throw new Error("The catalog response was invalid.");
  return data as Product[];
}
