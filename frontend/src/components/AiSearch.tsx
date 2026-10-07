import { useState } from 'react'
import './AiSearch.css'

interface Match {
  filename: string
  score: number
}

function AiSearch() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [results, setResults] = useState<Match[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  async function searchFile(file: File) {
    setFileName(file.name)
    setResults(null)
    setError(null)
    setLoading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://127.0.0.1:8000/search', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Server responded with an error')
      }

      const data = await response.json()
      setResults(data.matches)
    } catch {
      setError('Could not reach the AI search service. Is the server running?')
    } finally {
      setLoading(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) void searchFile(file)
  }

  return (
    <section className="ai-section" id="ai-search" data-reveal>
      <div className="wrap">
        <div className="ai-grid">
        <div className="ai-copy">
          <div className="ai-badge"><span className="dot" /> Applied ML feature</div>
          <h2>Find your<br />shoe by photo.</h2>
          <p>Snap or upload any shoe photo — the model finds the closest visual matches in the hexshoes catalog, ranked by similarity.</p>
          <div className="ai-steps">
            <div className="ai-step"><span className="n">01</span><span className="t"><strong>Embed —</strong> image converted to a feature vector (CLIP/ResNet)</span></div>
            <div className="ai-step"><span className="n">02</span><span className="t"><strong>Compare —</strong> checked against the full catalog by cosine similarity</span></div>
            <div className="ai-step"><span className="n">03</span><span className="t"><strong>Rank —</strong> closest matches returned instantly</span></div>
          </div>
        </div>

        <div className="demo-box">
          <label
            className={`drop-zone${dragActive ? ' drag-active' : ''}`}
            htmlFor="file-input"
            onDragOver={(event) => event.preventDefault()}
            onDragEnter={(event) => { event.preventDefault(); setDragActive(true) }}
            onDragLeave={(event) => { event.preventDefault(); setDragActive(false) }}
            onDrop={(event) => {
              event.preventDefault()
              setDragActive(false)
              const file = event.dataTransfer.files[0]
              if (file) void searchFile(file)
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M12 16V4m0 0L7 9m5-5l5 5" /><path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" /></svg>
            <span className="lbl">
              {loading
                ? `Analyzing ${fileName}…`
                : fileName
                ? `Last upload: ${fileName}`
                : 'Drop a photo, or click to upload'}
            </span>
            <span className="sub">JPG or PNG</span>
            <input
              type="file"
              id="file-input"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>

          {error && <p className="error-msg">{error}</p>}

          {results && (
            <div className="results show">
              {results.map((match) => (
                <div className="result-tile" key={match.filename}>
                  <img src={`/catalog/${match.filename}`} alt={match.filename} loading="lazy" />
                  <span className="match-score">{(match.score * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </section>
  )
}

export default AiSearch