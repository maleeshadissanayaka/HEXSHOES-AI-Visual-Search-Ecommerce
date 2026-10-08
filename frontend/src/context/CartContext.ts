import { createContext } from "react";
import type { CartItem, Product } from "../types/product";
export interface CartState {
  items: CartItem[];
  count: number;
  add: (
    product: Product,
    size: string | null,
    color: string | null,
    quantity: number,
  ) => string | null;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  storageAvailable: boolean;
}
export const CartContext = createContext<CartState | null>(null);
