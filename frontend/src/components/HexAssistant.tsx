import { useState } from 'react';
import Icon from './Icon';
import './HexAssistant.css';
export default function HexAssistant() { const [open, setOpen] = useState(false); return <><button className="chat-fab" aria-expanded={open} aria-controls="assistant-panel" onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'chat'}/>HEX Assistant</button>{open && <aside className="chat-panel" id="assistant-panel" aria-label="HEX Assistant prototype"><span className="eyebrow">PROTOTYPE · COMING NEXT</span><h3>HEX Assistant</h3><p>Our shopping assistant is in development. Personalized recommendations and product comparisons are coming next.</p><a href="#ai-search" onClick={() => setOpen(false)}>Try the implemented visual search <Icon name="arrow"/></a></aside>}</>; }
