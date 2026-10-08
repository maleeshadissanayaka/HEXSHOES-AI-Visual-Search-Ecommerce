import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Link } from "react-router-dom";
import Modal from "../shared/Modal";
import Icon from "../shared/Icon";
import useMediaQuery from "../../hooks/useMediaQuery";
import "./Hero.css";
const videoSrc = "/media/hero/campaign-running.mp4";
const poster = "/editorial/hero-grid.webp";
const entrance = (delay: number) =>
  ({ "--enter-delay": `${delay}ms` }) as CSSProperties;
function Film({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Campaign preview" onClose={onClose} className="film-dialog">
      <span className="eyebrow">HEX / CAMPAIGN STUDY</span>
      <h2>Movement, in focus.</h2>
      <video
        controls
        playsInline
        preload="metadata"
        poster={poster}
        src={videoSrc}
      />
      <p>
        Sample campaign footage. Presentation imagery, not official product
        photography.
      </p>
    </Modal>
  );
}
export default function Hero() {
  const [film, setFilm] = useState(false);
  const [paused, setPaused] = useState(true);
  const [failed, setFailed] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const manuallyPaused = useRef(false);
  const playDecorativeVideo = useMediaQuery(
    "(min-width: 769px) and (prefers-reduced-motion: no-preference)",
  );
  const close = useCallback(() => setFilm(false), []);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) element.pause();
        else if (!manuallyPaused.current) void element.play().catch(() => {});
      },
      { threshold: 0.1 },
    );
    observer.observe(element);
    const visibility = () => {
      if (document.hidden) element.pause();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      element.pause();
    };
  }, [playDecorativeVideo, failed]);
  function toggleVideo() {
    const element = video.current;
    if (!element) return;
    if (element.paused) {
      manuallyPaused.current = false;
      void element.play().catch(() => {});
    } else {
      manuallyPaused.current = true;
      element.pause();
    }
  }
  return (
    <>
      <section className="hero" id="top">
        <img
          className="hero-image"
          src={poster}
          alt="Performance footwear moving across wet city pavement in golden light"
          srcSet="/editorial/hero-grid-800.webp 800w, /editorial/hero-grid.webp 1600w"
          sizes="100vw"
          fetchPriority="high"
        />
        {playDecorativeVideo && !failed && (
          <video
            ref={video}
            className="hero-video"
            src={videoSrc}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            onPlay={() => setPaused(false)}
            onPause={() => setPaused(true)}
            onError={() => setFailed(true)}
          />
        )}
        <div className="hero-fade" />
        <div className="wrap hero-content">
          <span className="eyebrow hero-enter" style={entrance(0)}>
            FW26 COLLECTION
          </span>
          <h1>
            <span className="hero-line hero-enter" style={entrance(70)}>
              BUILT
            </span>
            <span className="hero-line hero-enter" style={entrance(140)}>
              FOR THE
            </span>
            <span className="hero-line">
              <span className="outline hero-enter" style={entrance(210)}>
                GRID
              </span>
              <span
                className="hero-dot hero-enter"
                aria-hidden="true"
                style={entrance(270)}
              />
            </span>
          </h1>
          <p className="hero-enter" style={entrance(320)}>
            Performance footwear for a more connected world.
            <br />
            Engineered for movement. Designed for what&apos;s next.
          </p>
          <div className="hero-ctas hero-enter" style={entrance(380)}>
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
        <div className="hero-caption">
          <span>01 / MOVEMENT STUDY</span>
          <span>Footwear. Form. Forward.</span>
        </div>
        {playDecorativeVideo && !failed && (
          <button
            className="hero-video-control"
            onClick={toggleVideo}
            aria-label={
              paused ? "Play background video" : "Pause background video"
            }
            aria-pressed={!paused}
          >
            <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>
            {paused ? "PLAY VIDEO" : "PAUSE VIDEO"}
          </button>
        )}
      </section>
      {film && <Film onClose={close} />}
    </>
  );
}
