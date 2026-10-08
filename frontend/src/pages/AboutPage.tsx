import { Link } from "react-router-dom";
import OurStory from "../components/home/OurStory";
export default function AboutPage() {
  return (
    <div>
      <OurStory showLink={false} />
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
        <section className="editorial-block editorial-spread" data-reveal>
          <img
            src="/editorial/hero-grid-800.webp"
            alt="Presentation campaign: movement through the city"
            loading="lazy"
          />
          <div>
            <h2>Design, with purpose.</h2>
            <p>
              HEXSHOES explores how performance footwear, retail design and
              intelligent technology can work together. The platform uses a live
              Firestore catalog and a real CLIP visual-search pipeline.
            </p>
          </div>
        </section>
        <section
          className="editorial-block editorial-spread reverse"
          data-reveal
        >
          <img
            src="/editorial/trail-800.webp"
            alt="Presentation campaign: footwear in a mountain landscape"
            loading="lazy"
          />
          <div>
            <h2>A small-batch mindset.</h2>
            <p>
              Small-batch production is the brand direction. Verified sourcing,
              manufacturing and sustainability documentation are not yet
              available; this platform does not claim certifications or measured
              environmental impact.
            </p>
          </div>
        </section>
        <section className="editorial-block">
          <h2>Technology meets footwear.</h2>
          <p>
            A photograph can be a starting point for discovery. Our image search
            ranks catalog references by visual similarity, while the store keeps
            verified product facts separate from campaign imagery.
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
