import { useRef, useState } from 'react';
import type { Product } from '../data/products';
import Icon from './Icon';
import './AiSearch.css';
interface Match {
    filename: string;
    score: number;
}
export default function AiSearch() {
    const [fileName, setFileName] = useState('');
    const [results, setResults] = useState<Match[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [mapping, setMapping] = useState<Product[]>([]);
    const [preview, setPreview] = useState<string | null>(null);
    const pending = useRef(false);
    async function searchFile(file: File) {
        if (pending.current)
            return;
        setError(null);
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            setError('Please upload a JPG or PNG image.');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setError('Please choose an image smaller than 10 MB.');
            return;
        }
        pending.current = true;
        setLoading(true);
        setFileName(file.name);
        setResults(null);
        const reader = new FileReader();
        reader.onload = () => setPreview(String(reader.result));
        reader.readAsDataURL(file);
        const form = new FormData();
        form.append('file', file);
        try {
            const response = await fetch('http://127.0.0.1:8000/search', { method: 'POST', body: form, signal: AbortSignal.timeout(120000) });
            if (!response.ok)
                throw new Error('Search failed');
            const data = await response.json();
            if (!Array.isArray(data.matches) || !data.matches.every((m: Match) => typeof m.filename === 'string' && Number.isFinite(m.score)))
                throw new Error('Invalid results');
            setResults(data.matches);
            try {
                const products = await fetch('http://localhost:4000/api/products');
                if (products.ok)
                    setMapping(await products.json());
            }
            catch { /* Catalog mapping is optional; search results remain available. */ }
        }
        catch {
            setError('Visual search is unavailable right now. Please check the AI service and try again.');
        }
        finally {
            pending.current = false;
            setLoading(false);
        }
    }
    return <section className="ai-section section-space" id="ai-search" data-reveal><div className="wrap ai-grid"><div className="ai-copy"><span className="eyebrow">VISUAL DISCOVERY · POWERED BY CLIP</span><h2>FIND YOUR NEXT<br />PAIR WITH AI</h2><p>Upload a shoe photo and our AI will find visually similar styles from our collection.</p><ol className="ai-steps">{[['EMBED', 'Convert the uploaded image into a visual embedding.'], ['COMPARE', 'Compare against catalog embeddings using cosine similarity.'], ['RANK', 'Return the most visually similar products.']].map(([title, copy], i) => <li key={title}><span className="step-number">0{i + 1}</span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ol></div><div className="ai-upload"><label className={`drop-zone${dragActive ? ' drag-active' : ''}`} onDragOver={e => e.preventDefault()} onDragEnter={e => { e.preventDefault(); setDragActive(true); }} onDragLeave={() => setDragActive(false)} onDrop={e => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0])
        void searchFile(e.dataTransfer.files[0]); }}><Icon name="upload"/><span>{loading ? 'Finding visually similar styles…' : 'Drop an image here'}</span><strong>or click to upload</strong><small>JPG, PNG up to 10 MB</small><input id="file-input" type="file" accept="image/jpeg,image/png" aria-label="Upload shoe image" disabled={loading} onChange={e => { if (e.target.files?.[0])
        void searchFile(e.target.files[0]); e.target.value = ''; }}/></label><div aria-live="polite">{error && <p className="error-msg" role="alert">{error}</p>}{preview && <div className="upload-preview"><img src={preview} alt="Your uploaded shoe"/><span>{fileName}</span></div>}{results && <><h3 className="results-title">Similar styles <span>Cosine similarity score</span></h3>{results.length === 0 && <p>No catalog matches were returned.</p>}<div className="results">{results.map(match => { const product = mapping.find(p => p.catalogFilename === match.filename || p.image?.split('/').pop() === match.filename); return <article className="result-tile" key={match.filename}><img src={`/catalog/${encodeURIComponent(match.filename)}`} alt={product?.name ?? `Catalog shoe ${match.filename}`}/><span className="match-score">{match.score.toFixed(3)} similarity</span><span className="result-name">{product?.name ?? match.filename}</span></article>; })}</div></>}</div></div></div></section>;
}
