interface NavbarProps {
  wishlistCount: number
  cartCount: number
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 2 5 5.5 5c2 0 3.5 1.2 4.5 2.7C11 6.2 12.5 5 14.5 5 18 5 19.5 8.5 17.5 12.5 15 16.65 12 21 12 21z" />
    </svg>
  )
}

import './Navbar.css'

function Navbar({ wishlistCount, cartCount }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="wrap nav-inner">
        <a className="nav-mark" href="#top" aria-label="HEXSHOES home">HEX<span>S</span>HOES</a>
        <div className="nav-links">
          <a href="#cats">Men</a>
          <a href="#cats">Women</a>
          <a href="#rail">New Drops</a>
          <a href="#ai-search">Find My Shoe</a>
        </div>
        <div className="nav-right">
          <a href="#">Sign in</a>
          <div className="wish-pill" aria-label={`${wishlistCount} items in wishlist`}>
            <HeartIcon />
            <span>{wishlistCount}</span>
          </div>
          <div className="cart-pill">Cart · <span>{cartCount}</span></div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar