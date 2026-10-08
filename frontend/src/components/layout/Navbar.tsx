import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCart, useWishlist } from "../../hooks/useStore";
import Icon from "../shared/Icon";
import SearchOverlay from "../shared/SearchOverlay";
import MobileMenu from "./MobileMenu";
import "./Navbar.css";
const links = [
  ["MEN", "/men"],
  ["WOMEN", "/women"],
  ["NEW DROPS", "/new-drops"],
  ["FIND MY SHOE", "/visual-search"],
  ["ABOUT", "/about"],
  ["CONTACT", "/contact"],
] as const;
export default function Navbar() {
  const [menu, setMenu] = useState(false),
    [search, setSearch] = useState(false),
    [scrolled, setScrolled] = useState(false);
  const cart = useCart(),
    wishlist = useWishlist(),
    location = useLocation();
  const closeMenu = useCallback(() => setMenu(false), []),
    closeSearch = useCallback(() => setSearch(false), []);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 40);
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  return (
    <>
      <nav
        className={`navbar${scrolled || location.pathname !== "/" ? " scrolled" : ""}`}
        aria-label="Main navigation"
      >
        <div className="wrap nav-inner">
          <Link className="nav-mark" to="/" aria-label="HEXSHOES home">
            HEX<strong>SHOES</strong>
            <sup>™</sup>
          </Link>
          <div className="nav-links">
            {links.map(([label, to]) => (
              <NavLink key={to} to={to}>
                {label}
              </NavLink>
            ))}
          </div>
          <div className="nav-right">
            <button
              className="nav-search"
              onClick={() => setSearch(true)}
              aria-label="Search products"
            >
              <Icon name="search" />
              <span>Search sneakers, styles...</span>
            </button>
            <Link
              to="/wishlist"
              aria-label={`Wishlist, ${wishlist.ids.length} items`}
            >
              <Icon name="heart" />
              <span className="wish-count" key={wishlist.ids.length}>
                {wishlist.ids.length}
              </span>
            </Link>
            <Link
              className="cart-pill"
              to="/cart"
              aria-label={`Cart, ${cart.count} items`}
            >
              <Icon name="bag" />
              <span key={cart.count}>{cart.count}</span>
            </Link>
            <Link to="/account" className="account-link" aria-label="Account">
              <span>ACCOUNT</span>
            </Link>
            <button
              className="menu-button"
              aria-label="Menu"
              aria-expanded={menu}
              onClick={() => setMenu(true)}
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </nav>
      {search && <SearchOverlay onClose={closeSearch} />}{" "}
      {menu && <MobileMenu onClose={closeMenu} />}
    </>
  );
}
