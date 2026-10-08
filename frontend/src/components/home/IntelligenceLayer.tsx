import IntelligenceCard from "../ai/IntelligenceCard";
import "./IntelligenceLayer.css";
import { intelligenceFeatures as features } from "../../data/intelligence";
import { Link } from "react-router-dom";
import { catalogImage } from "../../services/aiSearch";
import Icon from "../shared/Icon";
export default function IntelligenceLayer() {
  return (
    <section className="intelligence section-space" id="technology" data-reveal>
      <div className="wrap">
        <div className="section-heading">
          <h2>THE INTELLIGENCE LAYER</h2>
          <span className="eyebrow">
            BUILT WITH AI / ML / DL / DATA SCIENCE
          </span>
        </div>
        <p className="intelligence-intro">
          A new perspective on finding your next pair.
        </p>
        <div className="intelligence-showcase">
          <article className="intelligence-feature" data-reveal>
            <div>
              <span className="status-pill live">LIVE / VISUAL SEARCH</span>
              <h3>
                Start with an image.
                <br />
                Discover a direction.
              </h3>
              <p>
                Real visual retrieval. An image becomes a vector; similar forms
                rise to the surface.
              </p>
              <Link to="/visual-search" className="btn btn-solid">
                EXPLORE VISUAL SEARCH <Icon name="arrow" />
              </Link>
            </div>
            <div
              className="intelligence-art"
              aria-label="Real AI catalog references and image retrieval pipeline"
            >
              <span className="eyebrow">
                CATALOG REFERENCES / NOT STORE PRODUCTS
              </span>
              <div className="intelligence-reference-images">
                <img
                  src={catalogImage("shoe5.jpg")}
                  alt="CLIP catalog reference shoe5.jpg"
                  loading="lazy"
                />
                <img
                  src={catalogImage("shoe9.jpg")}
                  alt="CLIP catalog reference shoe9.jpg"
                  loading="lazy"
                />
              </div>
              <div className="vector-flow">
                <span>IMAGE</span>
                <span aria-hidden="true">→</span>
                <span>512-D VECTOR</span>
                <span aria-hidden="true">→</span>
                <span>TOP-K</span>
              </div>
              <span className="technical-caption">
                ViT-B-32 / L2 NORMALIZED / COSINE SIMILARITY
              </span>
            </div>
          </article>
          <div className="intelligence-secondary">
            {features.slice(1, 3).map((feature) => (
              <IntelligenceCard
                key={feature.title}
                {...feature}
                stages={[...feature.stages]}
              />
            ))}
          </div>
        </div>
        <div className="intelligence-research" data-reveal>
          <span className="eyebrow">THE NEXT HORIZON</span>
          {features.slice(3).map((feature) => (
            <Link key={feature.title} to="/technology#roadmap">
              <span className="feature-status">{feature.status}</span>
              <h3>{feature.title}</h3>
              <Icon name="arrow" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
