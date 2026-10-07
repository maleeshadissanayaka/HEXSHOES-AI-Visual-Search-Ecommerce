import { useCallback, useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import ProductRail from './components/ProductRail';
import AiSearch from './components/AiSearch';
import HomepageSections from './components/HomepageSections';
import OurStory from './components/OurStory';
import IntelligenceLayer from './components/IntelligenceLayer';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import InfoModal, { type InfoTopic } from './components/InfoModal';
import HexAssistant from './components/HexAssistant';
function App() {
    const [wishlist, setWishlist] = useState<Set<string>>(() => new Set());
    const [cartCount, setCartCount] = useState(0);
    const [infoTopic, setInfoTopic] = useState<InfoTopic | null>(null);
    const closeInfoModal = useCallback(() => setInfoTopic(null), []);
    useEffect(() => {
        const elements = document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-stagger]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        elements.forEach((element) => observer.observe(element));
        return () => {
            observer.disconnect();
        };
    }, []);
    function toggleWishlist(productId: string) {
        setWishlist((current) => {
            const next = new Set(current);
            if (next.has(productId))
                next.delete(productId);
            else
                next.add(productId);
            return next;
        });
    }
    return (<>
      <a className="skip-link" href="#main">Skip to content</a>
      <Ticker />
      <Navbar wishlistCount={wishlist.size} cartCount={cartCount}/>
      <main id="main">
      <Hero />
      <HomepageSections />
      <ProductRail wishlist={wishlist} onToggleWishlist={toggleWishlist} onAddToCart={() => setCartCount((count) => count + 1)}/>
      <AiSearch />
      <IntelligenceLayer />
      <OurStory onOpenInfo={setInfoTopic}/>
      <Newsletter />
      </main>
      <Footer onOpenInfo={setInfoTopic}/>
      {infoTopic && <InfoModal topic={infoTopic} onClose={closeInfoModal}/>}
      <HexAssistant />
    </>);
}
export default App;
