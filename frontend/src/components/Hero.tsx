import { useCallback, useRef, useState } from 'react';
import useModal from '../hooks/useModal';
import Icon from './Icon';
import './Hero.css';
function Film({ onClose }: {
    onClose: () => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    useModal(ref, onClose);
    return <div className="modal-overlay open" onMouseDown={e => e.target === e.currentTarget && onClose()}><div className="film-dialog" role="dialog" aria-modal="true" aria-label="Campaign film" ref={ref}><button className="modal-close" onClick={onClose} aria-label="Close film"><Icon name="close"/></button><h2>Movement, in focus.</h2><p>Campaign film coming soon.</p><img src="/editorial/hero-grid.png" alt="Footwear campaign on a city street"/></div></div>;
}
export default function Hero() {
    const [film, setFilm] = useState(false);
    const close = useCallback(() => setFilm(false), []);
    return <><section className="hero" id="top"><img className="hero-image" src="/editorial/hero-grid.png" alt="White performance footwear moving across wet city pavement in golden light" fetchPriority="high"/><div className="hero-fade"/><div className="wrap hero-content"><span className="eyebrow">FW26 COLLECTION</span><h1>BUILT<br />FOR THE<br /><span className="outline">GRID</span><span className="hero-dot" aria-hidden="true"/></h1><p>PERFORMANCE FOOTWEAR FOR A MORE CONNECTED WORLD.<br />ENGINEERED FOR MOVEMENT. DESIGNED FOR WHAT’S NEXT.</p><div className="hero-ctas"><a href="#rail" className="btn btn-solid">SHOP NEW DROPS <Icon name="arrow"/></a><button className="btn btn-ghost" onClick={() => setFilm(true)}><span className="play-circle"><Icon name="play"/></span>WATCH FILM</button></div></div><div className="campaign-detail" aria-hidden="true"><p>CITY<br />TRAIL<br />EVERYDAY<br />BEYOND</p><span className="campaign-index">01</span><span>02</span><span>03</span><span>04</span></div></section>{film && <Film onClose={close}/>}</>;
}
