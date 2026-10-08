import { useEffect, useRef, useState } from "react";
import type { VisualMatch } from "../../types/product";
import { searchImage, validateShoeImage } from "../../services/aiSearch";
import AiUpload from "./AiUpload";
import AiResults from "./AiResults";
import "./AiSearch.css";
export default function AiSearch() {
  const [results, setResults] = useState<VisualMatch[] | null>(null),
    [loading, setLoading] = useState(false),
    [error, setError] = useState(""),
    [preview, setPreview] = useState(""),
    [filename, setFilename] = useState("");
  const pending = useRef(false),
    abort = useRef<AbortController | null>(null);
  useEffect(() => () => abort.current?.abort(), []);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  async function upload(file: File) {
    if (pending.current) return;
    setError("");
    const validation = validateShoeImage(file);
    if (validation) {
      setError(validation);
      return;
    }
    pending.current = true;
    setLoading(true);
    setResults(null);
    setFilename(file.name);
    setPreview(URL.createObjectURL(file));
    abort.current = new AbortController();
    const timeout = window.setTimeout(() => abort.current?.abort(), 120000);
    try {
      setResults(await searchImage(file, abort.current.signal));
    } catch (e) {
      if (!abort.current.signal.aborted)
        setError(e instanceof Error ? e.message : "Visual search unavailable.");
      else setError("Search timed out. Please try again.");
    } finally {
      window.clearTimeout(timeout);
      pending.current = false;
      setLoading(false);
    }
  }
  return (
    <section className="ai-section section-space" id="ai-search" data-reveal>
      <div className="wrap ai-grid">
        <div className="ai-copy">
          <span className="eyebrow">VISUAL DISCOVERY / POWERED BY CLIP</span>
          <h2>
            FIND YOUR NEXT
            <br />
            PAIR WITH AI
          </h2>
          <p>
            Upload a shoe photo and our AI will find visually similar styles
            from our collection.
          </p>
          <ol className="ai-steps">
            {[
              ["EMBED", "Convert your image into a visual embedding."],
              [
                "COMPARE",
                "Compare against catalog embeddings using cosine similarity.",
              ],
              ["RANK", "Return the closest visual matches."],
            ].map(([title, copy], i) => (
              <li key={title}>
                <span className="step-number">0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="ai-upload">
          <AiUpload loading={loading} onFile={(file) => void upload(file)} />
          <div aria-live="polite" aria-busy={loading}>
            {loading && (
              <div className="analysis-state" role="status">
                <span className="analysis-orbit" aria-hidden="true" />
                <div>
                  <h3>Analyzing your image</h3>
                  <p>
                    Generating visual embedding · Comparing catalog vectors ·
                    Ranking similar styles
                  </p>
                  <small>CLIP / ViT-B-32 · Request in progress</small>
                </div>
              </div>
            )}
            {error && (
              <p role="alert" className="error-msg">
                {error}
              </p>
            )}
            {preview && (
              <div className="upload-preview">
                <img src={preview} alt="Your uploaded shoe" />
                <span>{filename}</span>
              </div>
            )}
            {results && <AiResults matches={results} />}
          </div>
        </div>
      </div>
    </section>
  );
}
