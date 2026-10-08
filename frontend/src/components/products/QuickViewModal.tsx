import type { Product } from "../../types/product";
import Modal from "../shared/Modal";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import "./QuickViewModal.css";
export default function QuickViewModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  return (
    <Modal
      title={`Quick view: ${product.name ?? product.id}`}
      onClose={onClose}
      className="quick-view"
    >
      <ProductGallery key={`gallery-${product.id}`} product={product} />
      <ProductInfo key={product.id} product={product} compact />
    </Modal>
  );
}
