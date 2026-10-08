import { useEffect, useState, type ReactNode } from "react";
import { CartContext } from "./CartContext";
import type { CartItem, Product } from "../types/product";
import { readStorage, writeStorage } from "../utils/storage";
import { productImage, productName } from "../utils/product";
const KEY = "hexshoes.cart.v1";
const valid = (value: unknown): value is CartItem[] =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      item &&
      typeof item.key === "string" &&
      typeof item.productId === "string" &&
      typeof item.name === "string" &&
      Number.isFinite(item.price) &&
      item.price >= 0 &&
      typeof item.currency === "string" &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      item.quantity <= 99 &&
      (item.size === null || typeof item.size === "string") &&
      (item.color === null || typeof item.color === "string"),
  );
export default function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState(() => readStorage(KEY, [], valid));
  const [storageAvailable, setStorageAvailable] = useState(true);
  useEffect(() => {
    const saved = writeStorage(KEY, items);
    queueMicrotask(() => setStorageAvailable(saved));
  }, [items]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === KEY) setItems(readStorage(KEY, [], valid));
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function update(change: (current: CartItem[]) => CartItem[]) {
    setItems((current) => {
      const next = change(current);
      return next;
    });
  }
  function add(
    product: Product,
    size: string | null,
    color: string | null,
    quantity: number,
  ): string | null {
    if (product.price === null || !product.currency)
      return "This product does not have a verified price and currency.";
    if (product.stock === 0) return "This product is out of stock.";
    if (
      product.availableSizes.length &&
      !product.availableSizes.some((value) => String(value) === size)
    )
      return "Select an available size.";
    if (product.colors.length && (!color || !product.colors.includes(color)))
      return "Select an available color.";
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99)
      return "Choose a quantity between 1 and 99.";
    const key = JSON.stringify([product.id, size, color]);
    const existing = items.find((item) => item.key === key);
    if (
      product.stock !== null &&
      (existing?.quantity ?? 0) + quantity > product.stock
    )
      return "This quantity exceeds the listed stock.";
    if (items.some((item) => item.currency !== product.currency))
      return "Items with different currencies need separate carts.";
    const line: CartItem = {
      key,
      productId: product.id,
      name: productName(product),
      price: product.price,
      currency: product.currency,
      image: productImage(product),
      size,
      color,
      quantity,
    };
    update((current) => {
      const match = current.find((item) => item.key === key);
      return match
        ? current.map((item) =>
            item.key === key
              ? { ...item, quantity: Math.min(99, item.quantity + quantity) }
              : item,
          )
        : [...current, line];
    });
    return null;
  }
  return (
    <CartContext.Provider
      value={{
        items,
        count: items.reduce((sum, item) => sum + item.quantity, 0),
        add,
        setQuantity: (key, quantity) =>
          update((current) =>
            current.map((item) =>
              item.key === key
                ? {
                    ...item,
                    quantity: Math.max(
                      1,
                      Math.min(99, Math.trunc(quantity) || 1),
                    ),
                  }
                : item,
            ),
          ),
        remove: (key) =>
          update((current) => current.filter((item) => item.key !== key)),
        clear: () => update(() => []),
        storageAvailable,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
