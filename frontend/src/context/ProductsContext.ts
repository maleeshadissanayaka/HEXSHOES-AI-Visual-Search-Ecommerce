import { createContext } from "react";
import type { Product } from "../types/product";
export interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  retry: () => void;
}
export const ProductsContext = createContext<ProductsState | null>(null);
