import { useEffect, useState, type ReactNode } from "react";
import { WishlistContext } from "./WishlistContext";
import { readStorage, writeStorage } from "../utils/storage";
const KEY = "hexshoes.wishlist.v1";
const valid = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((id) => typeof id === "string");
export default function WishlistProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [ids, setIds] = useState(() => [
    ...new Set(readStorage(KEY, [], valid)),
  ]);
  const [storageAvailable, setStorageAvailable] = useState(true);
  useEffect(() => {
    const saved = writeStorage(KEY, ids);
    queueMicrotask(() => setStorageAvailable(saved));
  }, [ids]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === KEY) setIds(readStorage(KEY, [], valid));
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function toggle(id: string) {
    setIds((current) => {
      const next = current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id];
      return next;
    });
  }
  return (
    <WishlistContext.Provider value={{ ids, toggle, storageAvailable }}>
      {children}
    </WishlistContext.Provider>
  );
}
