import { useEffect, useRef, useState, type FormEvent } from 'react'
import './HexAssistant.css'

interface ChatMessage {
  text: string
  who: 'bot' | 'user'
}

const suggestions = [
  { label: 'Best runner?', question: "What's your best runner?" },
  { label: 'Sizing help', question: 'How does sizing work?' },
  { label: 'Materials', question: 'What are your materials?' },
]

function HexAssistant() {
  const [open, setOpen] = useState(false)
  const [ping, setPing] = useState(true)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    { text: "Hey! I'm the Hex Assistant. Ask me about sizing, materials, or which pair fits your style.", who: 'bot' },
  ])
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [messages])

  function getReply(question: string) {
    const lower = question.toLowerCase()
    if (lower.includes('size') || lower.includes('sizing') || lower.includes('chart')) {
      return 'We run true to UK sizing. Quick chart: UK 6 = EU 39/US 7, UK 8 = EU 42/US 9, UK 10 = EU 44/US 11. Between sizes? Size up for the Hex Trail since it\'s a snugger fit. Full chart is in the footer under Sizing Guide.'
    }
    if (lower.includes('return') || lower.includes('refund')) {
      return 'Unworn items in original packaging can be returned within 30 days for a full refund — see the Returns link in the footer for details.'
    }
    if (lower.includes('ship')) {
      return 'Standard shipping takes 3–5 business days, and it\'s free on orders over $150.'
    }
    if (lower.includes('material')) {
      return 'Most pairs use matte canvas or ripstop uppers with a cork or rubber sole — durable and breathable.'
    }
    if (lower.includes('runner') || lower.includes('best')) {
      return 'The Hex Runner 02 is our best all-rounder — low-profile, matte canvas, $128.'
    }
    if (lower.includes('trail')) {
      return 'The Hex Trail is built for rougher terrain — high-ankle with a ripstop panel, $164.'
    }
    if (lower.includes('price') || lower.includes('cost')) {
      return 'Prices range from $74 (Hex Slide) to $188 (Hex Formal) depending on the pair.'
    }
    return "I'd recommend the Hex Runner 02 — it's our most popular low-profile pair, true to size."
  }

  function sendMessage(text: string) {
    const value = text.trim()
    if (!value) return
    setMessages((current) => [...current, { text: value, who: 'user' }])
    window.setTimeout(() => {
      setMessages((current) => [...current, { text: getReply(value), who: 'bot' }])
    }, 600)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    sendMessage(message)
    setMessage('')
  }

  function togglePanel() {
    setOpen((current) => !current)
    setPing(false)
  }

  return (
    <>
      <button className="chat-fab" type="button" aria-label={open ? 'Close Hex Assistant' : 'Open Hex Assistant'} aria-expanded={open} aria-controls="chat-panel" onClick={togglePanel}>
        {ping && <span className="ping" />}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
      </button>
      <section className={`chat-panel${open ? ' open' : ''}`} id="chat-panel" aria-label="Hex Assistant chat" aria-hidden={!open}>
        <div className="chat-head">
          <span className="dot" />
          <div>
            <h4>Hex Assistant</h4>
            <div className="sub">AI stylist — demo preview</div>
          </div>
        </div>
        <div className="chat-body" ref={bodyRef} aria-live="polite" aria-relevant="additions">
          {messages.map((item, index) => <div className={`chat-msg ${item.who}`} key={`${item.who}-${index}`}>{item.text}</div>)}
        </div>
        <div className="chat-suggestions">
          {suggestions.map((item) => <button className="chat-chip" type="button" key={item.label} onClick={() => sendMessage(item.question)}>{item.label}</button>)}
        </div>
        <form className="chat-input-row" onSubmit={handleSubmit}>
          <input type="text" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask the Hex Assistant…" aria-label="Message Hex Assistant" />
          <button className="chat-send" type="submit" aria-label="Send message">→</button>
        </form>
      </section>
    </>
  )
}

export default HexAssistant