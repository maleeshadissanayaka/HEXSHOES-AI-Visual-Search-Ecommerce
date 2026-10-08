import { NavLink } from "react-router-dom";
import Modal from "../shared/Modal";
import { navigationLinks } from "../../data/navigation";
const links = [
  ...navigationLinks,
  ["TECHNOLOGY", "/technology"],
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
