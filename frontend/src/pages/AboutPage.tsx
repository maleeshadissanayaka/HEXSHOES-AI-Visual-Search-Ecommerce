import { Link } from "react-router-dom";
import OurStory from "../components/home/OurStory";
export default function AboutPage() {
  return (
    <div>
      <OurStory />
      <div className="wrap page editorial-page">
        <span className="eyebrow">THE HEX PHILOSOPHY</span>
        <h1>Designed to move forward.</h1>
        <div className="editorial-columns">
          {[
            [
              "H",
              "Hover",
              "Lighter movement. Performance-focused products and considered everyday comfort.",
            ],
            [
              "E",
              "Elegance",
              "Timeless design. Clean silhouettes, purposeful details and a restrained visual language.",
            ],
            [
              "X",
              "Xperience",
              "A smarter way to shop. Computer vision brings a visual starting point to product discovery.",
            ],
          ].map(([letter, title, copy]) => (
            <article key={letter}>
              <span className="editorial-letter">{letter}</span>
              <h2>{title}</h2>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <section className="editorial-block">
          <h2>Design, with purpose.</h2>
          <p>
            HEXSHOES explores how performance footwear, retail design and
            intelligent technology can work together. The platform uses a live
            Firestore catalog and a real CLIP visual-search pipeline.
          </p>
        </section>
        <section className="editorial-block">
          <h2>Responsible production.</h2>
          <p>
            Small-batch production is the brand direction. Verified sourcing,
            manufacturing and sustainability documentation are not yet
            available; this platform does not claim certifications or measured
            environmental impact.
          </p>
        </section>
        <section className="editorial-block">
          <h2>A future shaped by discovery.</h2>
          <p>
            Personalized recommendations, demand forecasting and fit
            intelligence are on the roadmap. Each feature will be evaluated
            before performance claims are made.
          </p>
          <Link className="btn btn-solid" to="/technology">
            EXPLORE THE TECHNOLOGY
          </Link>
        </section>
      </div>
    </div>
  );
}
