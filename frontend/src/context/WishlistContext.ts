import { createContext } from "react";
export interface WishlistState {
  ids: string[];
  toggle: (id: string) => void;
  storageAvailable: boolean;
}
export const WishlistContext = createContext<WishlistState | null>(null);
