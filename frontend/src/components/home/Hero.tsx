import { useCallback, useEffect, useRef, useState } from "react";
import useModal from "../../hooks/useModal";
import Icon from "../shared/Icon";
import "./Hero.css";
import { Link } from "react-router-dom";
function Film({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useModal(ref, onClose);
  return (
    <div
      className="modal-overlay open"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="film-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Campaign film"
        ref={ref}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close film"
        >
          <Icon name="close" />
        </button>
        <h2>Movement, in focus.</h2>
        <p>Campaign film coming soon.</p>
        <img
          src="/editorial/hero-grid.webp"
          srcSet="/editorial/hero-grid-800.webp 800w, /editorial/hero-grid.webp 1600w"
          sizes="(max-width: 640px) 1440px, 100vw"
          alt="Footwear campaign on a city street"
        />
      </div>
    </div>
  );
}
export default function Hero() {
  const [film, setFilm] = useState(false);
  const campaignImage = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const move = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (campaignImage.current)
          campaignImage.current.style.transform = `translateY(${Math.min(window.scrollY * 0.025, 12)}px) scale(1.025)`;
      });
    };
    window.addEventListener("scroll", move, { passive: true });
    return () => {
      window.removeEventListener("scroll", move);
      cancelAnimationFrame(frame);
    };
  }, []);
  const close = useCallback(() => setFilm(false), []);
  return (
    <>
      <section className="hero" id="top">
        <img
          ref={campaignImage}
          className="hero-image"
          src="/editorial/hero-grid.webp"
          alt="White performance footwear moving across wet city pavement in golden light"
          fetchPriority="high"
        />
        <div className="hero-fade" />
        <div className="wrap hero-content">
          <span className="eyebrow">FW26 COLLECTION</span>
          <h1>
            BUILT
            <br />
            FOR THE
            <br />
            <span className="outline">GRID</span>
            <span className="hero-dot" aria-hidden="true" />
          </h1>
          <p>
            PERFORMANCE FOOTWEAR FOR A MORE CONNECTED WORLD.
            <br />
            ENGINEERED FOR MOVEMENT. DESIGNED FOR WHAT’S NEXT.
          </p>
          <div className="hero-ctas">
            <Link to="/new-drops" className="btn btn-solid">
              SHOP NEW DROPS <Icon name="arrow" />
            </Link>
            <button className="btn btn-ghost" onClick={() => setFilm(true)}>
              <span className="play-circle">
                <Icon name="play" />
              </span>
              WATCH FILM
            </button>
          </div>
        </div>
        <div className="campaign-detail" aria-hidden="true">
          <p>
            CITY
            <br />
            TRAIL
            <br />
            EVERYDAY
            <br />
            BEYOND
          </p>
          <span className="campaign-index">01</span>
          <span>02</span>
          <span>03</span>
          <span>04</span>
        </div>
      </section>
      {film && <Film onClose={close} />}
    </>
  );
}
