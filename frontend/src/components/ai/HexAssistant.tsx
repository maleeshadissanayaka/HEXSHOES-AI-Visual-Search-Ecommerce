import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/useStore";
import { assistantReply } from "../../services/assistant";
import { productName, displayPrice } from "../../utils/product";
import Modal from "../shared/Modal";
import Icon from "../shared/Icon";
import "./HexAssistant.css";
interface Message {
  role: "user" | "assistant";
  text: string;
  ids?: string[];
}
const chips = [
  "Find black runners",
  "Best shoe under $150",
  "Help me choose a trail shoe",
  "Show New Drops",
];
export default function HexAssistant() {
  const [open, setOpen] = useState(false),
    [input, setInput] = useState(""),
    [messages, setMessages] = useState<Message[]>([
      {
        role: "assistant",
        text: "I can help explore the real catalog using basic scripted matching. I am not LLM-powered. Ask about a style or budget.",
      },
    ]);
  const { products, loading, error } = useProducts();
  const close = useCallback(() => setOpen(false), []),
    history = useRef<HTMLDivElement>(null);
  useEffect(() => {
    history.current?.scrollTo({
      top: history.current.scrollHeight,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }, [messages]);
  function send(value: string) {
    const text = value.trim();
    if (!text || loading || error) return;
    const reply = assistantReply(text, products);
    setMessages((current) => [
      ...current,
      { role: "user", text },
      { role: "assistant", ...reply },
    ]);
    setInput("");
  }
  return (
    <>
      <button
        className="chat-fab"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Icon name="chat" />
        HEX Assistant
      </button>
      {open && (
        <Modal
          title="HEX Assistant"
          onClose={close}
          className="assistant-modal"
        >
          <span className="eyebrow">PRODUCT-AWARE / SCRIPTED ASSISTANT</span>
          <h2>Find your next move.</h2>
          <p className="assistant-disclosure">
            Basic catalog matching. LLM integration is planned.
          </p>
          <div className="assistant-history" ref={history} aria-live="polite">
            {messages.map((message, i) => (
              <div className={`assistant-message ${message.role}`} key={i}>
                <p>{message.text}</p>
                {message.ids?.map((id) => {
                  const product = products.find((p) => p.id === id);
                  return product ? (
                    <Link
                      key={id}
                      to={`/product/${encodeURIComponent(id)}`}
                      onClick={close}
                    >
                      {productName(product)}{" "}
                      <span>{displayPrice(product)}</span>
                    </Link>
                  ) : null;
                })}
              </div>
            ))}
          </div>
          {loading && <p role="status">Loading the product catalog...</p>}
          {error && <p role="alert">{error}</p>}
          <div className="assistant-chips">
            {chips.map((chip) => (
              <button
                key={chip}
                onClick={() => send(chip)}
                disabled={loading || !!error}
              >
                {chip}
              </button>
            ))}
          </div>
          <form
            className="assistant-input"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <label className="sr-only" htmlFor="assistant-input">
              Message HEX Assistant
            </label>
            <input
              id="assistant-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              placeholder="Ask about the collection..."
            />
            <button
              aria-label="Send message"
              type="submit"
              disabled={!input.trim() || loading || !!error}
            >
              <Icon name="arrow" />
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
