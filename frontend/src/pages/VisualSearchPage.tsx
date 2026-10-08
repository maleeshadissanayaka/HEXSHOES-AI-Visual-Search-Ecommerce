import AiSearch from "../components/ai/AiSearch";
import { Link } from "react-router-dom";
export default function VisualSearchPage() {
  return (
    <div className="visual-search-page">
      <h1 className="sr-only">AI Visual Search</h1>
      <AiSearch />
      <div className="wrap page">
        <span className="eyebrow">HOW IT WORKS</span>
        <h2>Visual similarity. Real mathematics.</h2>
        <p className="page-intro">
          Your image is encoded with OpenCLIP ViT-B-32. Normalized image vectors
          are compared to the existing catalog using cosine similarity. A score
          describes visual similarity, not a probability or model confidence.
        </p>
        <p className="muted">
          Product linking is pending until catalog filenames have verified
          Firestore assignments.
        </p>
        <Link className="text-link" to="/technology">
          Explore the technology →
        </Link>
      </div>
    </div>
  );
}
