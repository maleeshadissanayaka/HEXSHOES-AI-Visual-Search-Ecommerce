import { useEffect, useState, type ReactNode } from "react";
import { ProductsContext } from "./ProductsContext";
import { fetchProducts } from "../services/products";
import type { Product } from "../types/product";
export default function ProductsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const abort = new AbortController();
    fetchProducts(abort.signal)
      .then((data) => {
        setProducts(data);
        setLoading(false);
        setError(null);
      })
      .catch((e) => {
        if (!abort.signal.aborted) {
          setError(e instanceof Error ? e.message : "Catalog unavailable");
          setLoading(false);
        }
      });
    return () => abort.abort();
  }, [attempt]);
  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
        retry: () => {
          setLoading(true);
          setAttempt((n) => n + 1);
        },
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}
