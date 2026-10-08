import { Link } from "react-router-dom";
const stages = [
  [
    "01",
    "IMAGE",
    "A JPG or PNG shoe image is validated for format, upload size and safe decoding.",
  ],
  [
    "02",
    "PREPROCESS",
    "OpenCLIP preprocessing resizes, crops and normalizes the image for the existing encoder.",
  ],
  [
    "03",
    "ENCODE",
    "The pretrained OpenCLIP ViT-B-32 image encoder converts pixels into an image embedding.",
  ],
  [
    "04",
    "NORMALIZE",
    "The embedding is divided by its vector norm. Catalog vectors were normalized when built.",
  ],
  [
    "05",
    "COMPARE",
    "The dot product of normalized vectors computes cosine similarity.",
  ],
  [
    "06",
    "RANK",
    "The five highest similarities are returned with actual filenames and optional verified product IDs.",
  ],
];
export default function TechnologyPage() {
  return (
    <div className="wrap page technology-page">
      <span className="eyebrow">BUILT WITH AI / ML / DL / DATA SCIENCE</span>
      <h1>Intelligence, with intent.</h1>
      <p className="page-intro">
        Real computer vision. Transparent engineering. A measured roadmap.
      </p>
      <section id="visual-search">
        <span className="status-pill live">LIVE</span>
        <h2>AI visual search</h2>
        <p>
          FastAPI runs the existing PyTorch and OpenCLIP pipeline. The ViT-B-32
          encoder, pretrained with OpenAI weights, embeds the uploaded image in
          the same vector space as the catalog. No embeddings or model weights
          were rebuilt for this application.
        </p>
        <div className="pipeline" aria-label="Visual search pipeline">
          {stages.map(([number, title, copy]) => (
            <article key={number}>
              <span className="eyebrow">{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <div className="math-note">
          <code>
            similarity = dot(query / norm(query), catalog / norm(catalog))
          </code>
          <p>
            Cosine similarity measures alignment between vectors. It is not
            confidence, probability, fit accuracy, or purchase likelihood. No
            model accuracy is claimed without an evaluated dataset.
          </p>
        </div>
        <p className="muted">
          The catalog currently contains ten embedding entries. Canonical
          Firestore product linking is mapping pending; filenames and real
          scores remain available.
        </p>
        <Link className="btn btn-solid" to="/visual-search">
          TRY VISUAL SEARCH
        </Link>
      </section>
      <section id="roadmap">
        <h2>The intelligence roadmap</h2>
        <div className="roadmap-grid">
          {[
            [
              "IN DEVELOPMENT",
              "AI stylist",
              "Product-aware scripted assistance is available now. An LLM with catalog tools, session context and transparent recommendation explanations is a later integration.",
            ],
            [
              "PLANNED",
              "Recommendation system",
              "User preference modeling, content-based ranking and collaborative signals will require appropriate consent and real interaction data.",
            ],
            [
              "RESEARCH FEATURE",
              "Demand insights",
              "Demand forecasting, trend analysis and product analytics require historical sales data, baseline models and time-based evaluation.",
            ],
            [
              "PLANNED",
              "Fit intelligence",
              "Sizing recommendations require verified product dimensions, fit feedback and careful model evaluation.",
            ],
            [
              "RESEARCH FEATURE",
              "Data science",
              "Catalog data quality, visual-search retrieval evaluation and future customer segmentation will precede claims about model performance.",
            ],
          ].map(([status, title, copy]) => (
            <article key={title}>
              <span className="status-pill">{status}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
