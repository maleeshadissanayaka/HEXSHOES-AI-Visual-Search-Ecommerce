export interface Product {
  id: string;
  code: string | null;
  name: string | null;
  description: string | null;
  price: number | null;
  currency: string | null;
  category: string | null;
  gender: string | null;
  image: string | null;
  images: string[];
  aiImageFilename: string | null;
  availableSizes: (string | number)[];
  colors: string[];
  stock: number | null;
  isNew: boolean | null;
  featured: boolean | null;
  createdAt: string | null;
}
export interface CartItem {
  key: string;
  productId: string;
  name: string;
  price: number;
  currency: string;
  image: string | null;
  size: string | null;
  color: string | null;
  quantity: number;
}
export interface VisualMatch {
  productId: string | null;
  filename: string;
  score: number;
}
