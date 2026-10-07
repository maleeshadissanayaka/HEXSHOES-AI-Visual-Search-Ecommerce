import { useEffect, useState } from 'react';
import Icon from './Icon';
import './Navbar.css';
export default function Navbar({ wishlistCount, cartCount }: {
    wishlistCount: number;
    cartCount: number;
}) {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => { const scroll = () => setScrolled(window.scrollY > 40); scroll(); window.addEventListener('scroll', scroll, { passive: true }); return () => window.removeEventListener('scroll', scroll); }, []);
    useEffect(() => { const key = (e: KeyboardEvent) => { if (e.key === 'Escape')
        setOpen(false); }; document.addEventListener('keydown', key); return () => document.removeEventListener('keydown', key); }, []);
    return <nav className={`navbar${scrolled ? ' scrolled' : ''}`} aria-label="Main navigation"><div className="wrap nav-inner"><a className="nav-mark" href="#top" aria-label="HEXSHOES home">HEX<strong>SHOES</strong><sup>™</sup></a><div className={`nav-links${open ? ' open' : ''}`} id="main-navigation">{[['MEN', '#cats'], ['WOMEN', '#cats'], ['NEW DROPS', '#rail'], ['FIND MY SHOE', '#ai-search'], ['ABOUT', '#story'], ['CONTACT', '#footer']].map(([label, url]) => <a href={url} key={label} onClick={() => setOpen(false)}>{label}</a>)}</div><div className="nav-right"><a href="#ai-search" aria-label="Search"><Icon name="search"/></a><a href="#rail" aria-label={`${wishlistCount} items in wishlist`}><Icon name="heart"/><span className="wish-count">{wishlistCount}</span></a><a className="cart-pill" href="#rail" aria-label={`${cartCount} items in cart`}><Icon name="bag"/><span>{cartCount}</span></a><button className="menu-button" aria-label={open ? 'Close menu' : 'Menu'} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'menu'}/></button></div></div></nav>;
}
