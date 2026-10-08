import { Link } from "react-router-dom";
import { intelligenceFeatures } from "../data/intelligence";
const stages = [
  [
    "01",
    "UPLOAD",
    "Validate JPG/PNG MIME type, filename extension, upload size and safe image decoding.",
  ],
  [
    "02",
    "IMAGE PREPROCESSING",
    "OpenCLIP's existing image transform resizes, crops and normalizes pixels for the encoder.",
  ],
  [
    "03",
    "CLIP ViT-B-32",
    "ViT-B-32 turns the image into a 512-dimensional embedding: a learned numerical representation.",
  ],
  [
    "04",
    "512-D EMBEDDING",
    "The encoder output represents visual features in a shared image/text representation space.",
  ],
  [
    "05",
    "L2 NORMALIZATION",
    "L2 normalization divides the vector by its length. Catalog vectors are already normalized.",
  ],
  [
    "06",
    "COSINE SIMILARITY",
    "A dot product between unit vectors gives cosine similarity: alignment in the learned space.",
  ],
  [
    "07",
    "TOP-K RESULTS",
    "Sort similarities and return the top five catalog references, with product IDs only where verified.",
  ],
];
export default function TechnologyPage() {
  return (
    <div className="wrap page technology-page">
      <span className="eyebrow">
        ENGINEERING / COMPUTER VISION / DATA SCIENCE
      </span>
      <h1>Intelligence, with intent.</h1>
      <p className="page-intro">
        A working visual retrieval system inside a considered retail experience.
        Every capability has a clear boundary.
      </p>
      <section className="architecture-section">
        <h2>One platform. Two discovery paths.</h2>
        <div
          className="architecture-diagram"
          data-reveal
          aria-label="Actual architecture: React connects separately to Express and Firestore, and to FastAPI, PyTorch and OpenCLIP"
        >
          <span className="architecture-client">React / TypeScript</span>
          <div className="architecture-branches">
            <div>
              <span>CATALOG DISCOVERY</span>
              <strong>Express / TypeScript</strong>
              <span aria-hidden="true">↓</span>
              <strong>Firebase Firestore</strong>
            </div>
            <div>
              <span>VISUAL DISCOVERY</span>
              <strong>FastAPI / Python</strong>
              <span aria-hidden="true">↓</span>
              <strong>PyTorch / OpenCLIP</strong>
            </div>
          </div>
        </div>
        <div className="architecture-grid">
          {[
            [
              "01 / EXPERIENCE",
              "React + TypeScript",
              "Vite, React Router, lazy pages and shared providers. Browser-local cart and wishlist; environment-driven Firebase Auth.",
            ],
            [
              "02 / CATALOG API",
              "Express + TypeScript",
              "Read-only product endpoints, canonical document IDs, a strict response contract, origin allowlisting and structured errors.",
            ],
            [
              "03 / SOURCE OF FACTS",
              "Firebase Firestore",
              "The live store catalog. Missing photos, variants and attributes remain missing. A draft manifest supports validation and read-only previews.",
            ],
            [
              "04 / VISUAL RETRIEVAL",
              "FastAPI + PyTorch + OpenCLIP",
              "Existing pretrained weights and image embeddings. Uploads are processed in memory and are not saved by the endpoint.",
            ],
          ].map(([label, title, copy]) => (
            <article key={label}>
              <span className="eyebrow">{label}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <div
          className="architecture-flow"
          aria-label="Catalog and visual discovery data flow"
        >
          <p>Firestore → Express product contract → React storefront</p>
          <p>Uploaded image → FastAPI → CLIP ranking → React results</p>
          <p className="muted">
            The verified product–image registry connects these paths. Unresolved
            references stay unlinked.
          </p>
        </div>
      </section>
      <section id="visual-search">
        <span className="status-pill live">LIVE</span>
        <h2>From pixels to similar styles.</h2>
        <p>
          CLIP learns image and text representations through contrastive
          training. HEXSHOES uses the image encoder for image-to-image
          retrieval; it does not run text generation or an LLM.
        </p>
        <div className="pipeline" aria-label="Visual search pipeline">
          {stages.map(([number, title, copy]) => (
            <article key={number} data-reveal>
              <span className="eyebrow">{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <div className="editorial-columns">
          <article>
            <h3>What an embedding captures</h3>
            <p>
              A vector represents learned visual features rather than literal
              product facts. Similar vectors can reflect shape, composition or
              style. They do not prove that two photographs show the same SKU.
            </p>
          </article>
          <article>
            <h3>Why ViT-B-32?</h3>
            <p>
              The existing base Vision Transformer processes 32-pixel image
              patches. Its image output has 512 dimensions. We preserve the
              original encoder and cached OpenAI pretrained weights.
            </p>
          </article>
          <article>
            <h3>Ranking, not certainty</h3>
            <p>
              The highest cosine scores come first. A top result is the closest
              catalog vector in this search, not a guaranteed product identity
              or a fit recommendation.
            </p>
          </article>
        </div>
        <div className="math-note">
          <code>
            similarity = dot(query / norm(query), catalog / norm(catalog))
          </code>
          <p>
            Cosine similarity is not confidence, probability, purchase
            likelihood or model accuracy.
          </p>
        </div>
        <Link className="btn btn-solid" to="/visual-search">
          TRY VISUAL SEARCH
        </Link>
      </section>
      <section>
        <h2>Limits are part of the engineering.</h2>
        <ul className="technology-limits">
          <li>
            The current ten image references have no verified link to the four
            store products.
          </li>
          <li>
            Lighting, crop, viewpoint and background can affect results. This
            encoder has not been fine-tuned on HEXSHOES footwear.
          </li>
          <li>
            No held-out labeled evaluation has established recall@k, ranking
            quality or accuracy.
          </li>
          <li>
            The existing OpenCLIP loader emits a QuickGELU compatibility
            warning. Baseline evaluation is needed before changing model
            configuration or rebuilding vectors.
          </li>
          <li>
            Upload tests establish functional behavior and input validation, not
            retrieval performance.
          </li>
        </ul>
        <p className="muted">
          Next: approve product photography, establish authoritative mappings,
          then evaluate held-out queries against those relationships.
        </p>
      </section>
      <section id="roadmap">
        <h2>The intelligence roadmap</h2>
        <p>
          These are declared development directions, not deployed models or
          completed experiments.
        </p>
        <div className="roadmap-grid">
          {intelligenceFeatures
            .filter((feature) => feature.status !== "LIVE")
            .map((feature) => (
              <article key={feature.title}>
                <span className="status-pill">{feature.status}</span>
                <h3>{feature.title}</h3>
                <p>{feature.copy}</p>
              </article>
            ))}
        </div>
      </section>
      <section>
        <h2>Implementation references</h2>
        <p className="technology-sources">
          <a
            href="https://github.com/mlfoundations/open_clip"
            target="_blank"
            rel="noreferrer"
          >
            OpenCLIP implementation
          </a>
          <a
            href="https://github.com/mlfoundations/open_clip/blob/main/src/open_clip/model_configs/ViT-B-32.json"
            target="_blank"
            rel="noreferrer"
          >
            ViT-B-32 configuration
          </a>
          <a
            href="https://arxiv.org/abs/2103.00020"
            target="_blank"
            rel="noreferrer"
          >
            Original CLIP paper
          </a>
        </p>
      </section>
    </div>
  );
}
