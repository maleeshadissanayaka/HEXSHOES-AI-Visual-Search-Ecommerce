import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ProductsProvider from "./context/ProductsProvider";
import CartProvider from "./context/CartProvider";
import WishlistProvider from "./context/WishlistProvider";
import AuthProvider from "./context/AuthProvider";
import Navbar from "./components/layout/Navbar";
import Ticker from "./components/layout/Ticker";
import Footer from "./components/layout/Footer";
import InfoModal, { type InfoTopic } from "./components/shared/InfoModal";
import HexAssistant from "./components/ai/HexAssistant";
import Loader from "./components/shared/Loader";
import HomePage from "./pages/HomePage";
import "./App.css";
import "./styles/store.css";
import "./styles/premium.css";
const ShopPage = lazy(() => import("./pages/ShopPage")),
  MenPage = lazy(() => import("./pages/MenPage")),
  WomenPage = lazy(() => import("./pages/WomenPage")),
  NewDropsPage = lazy(() => import("./pages/NewDropsPage")),
  ProductPage = lazy(() => import("./pages/ProductPage")),
  VisualSearchPage = lazy(() => import("./pages/VisualSearchPage")),
  WishlistPage = lazy(() => import("./pages/WishlistPage")),
  CartPage = lazy(() => import("./pages/CartPage")),
  CheckoutPage = lazy(() => import("./pages/CheckoutPage")),
  AccountPage = lazy(() => import("./pages/AccountPage")),
  AboutPage = lazy(() => import("./pages/AboutPage")),
  TechnologyPage = lazy(() => import("./pages/TechnologyPage")),
  ContactPage = lazy(() => import("./pages/ContactPage")),
  NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const titles: Record<string, string> = {
  "/": "Built for the Grid",
  "/shop": "Shop",
  "/men": "Men",
  "/women": "Women",
  "/new-drops": "New Drops",
  "/visual-search": "AI Visual Search",
  "/wishlist": "Wishlist",
  "/cart": "Cart",
  "/checkout": "Demo Checkout",
  "/account": "Account",
  "/about": "Our Story",
  "/technology": "Technology",
  "/contact": "Contact",
};
function Shell() {
  const location = useLocation(),
    [topic, setTopic] = useState<InfoTopic | null>(null);
  const close = useCallback(() => setTopic(null), []);
  useEffect(() => {
    document.title = `${titles[location.pathname] ?? (location.pathname.startsWith("/product/") ? "Product" : "Page not found")} | HEXSHOES`;
    window.scrollTo(0, 0);
    if (location.pathname !== "/") document.getElementById("main")?.focus();
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.1 },
    );
    const observe = () =>
      document
        .querySelectorAll("[data-reveal]")
        .forEach((el) => observer.observe(el));
    observe();
    const mutations = new MutationObserver(observe);
    mutations.observe(document.getElementById("main")!, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, [location.pathname]);
  useEffect(() => {
    if (!location.hash) return;
    let anchor: string;
    try {
      anchor = decodeURIComponent(location.hash.slice(1));
    } catch {
      return;
    }
    const scroll = () => {
      const element = document.getElementById(anchor);
      if (!element) return false;
      element.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
      return true;
    };
    if (scroll()) return;
    const observer = new MutationObserver(() => {
      if (scroll()) observer.disconnect();
    });
    observer.observe(document.getElementById("main")!, {
      childList: true,
      subtree: true,
    });
    return () => observer.disconnect();
  }, [location.pathname, location.hash]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Ticker />
      <Navbar />
      <main id="main" tabIndex={-1}>
        <div className="route-surface" key={location.pathname}>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/men" element={<MenPage />} />
              <Route path="/women" element={<WomenPage />} />
              <Route path="/new-drops" element={<NewDropsPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/visual-search" element={<VisualSearchPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/technology" element={<TechnologyPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>
      </main>
      <Footer onOpenInfo={setTopic} />
      {topic && <InfoModal topic={topic} onClose={close} />}
      <HexAssistant />
    </>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <ProductsProvider>
        <WishlistProvider>
          <CartProvider>
            <AuthProvider>
              <Shell />
            </AuthProvider>
          </CartProvider>
        </WishlistProvider>
      </ProductsProvider>
    </BrowserRouter>
  );
}
