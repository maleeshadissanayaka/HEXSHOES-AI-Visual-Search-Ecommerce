import { NavLink } from "react-router-dom";
import Modal from "../shared/Modal";
const links = [
  ["MEN", "/men"],
  ["WOMEN", "/women"],
  ["NEW DROPS", "/new-drops"],
  ["FIND MY SHOE", "/visual-search"],
  ["ABOUT", "/about"],
  ["CONTACT", "/contact"],
  ["ACCOUNT", "/account"],
] as const;
export default function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Navigation menu" onClose={onClose} className="mobile-menu">
      <span className="eyebrow">HEXSHOES</span>
      <nav aria-label="Mobile navigation">
        {links.map(([label, to]) => (
          <NavLink key={to} to={to} onClick={onClose}>
            {label}
          </NavLink>
        ))}
      </nav>
    </Modal>
  );
}
