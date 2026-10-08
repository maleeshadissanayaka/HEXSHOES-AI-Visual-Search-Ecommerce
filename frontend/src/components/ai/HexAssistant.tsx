import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/useStore";
import { assistantReply } from "../../services/assistant";
import { productName, displayPrice } from "../../utils/product";
import Modal from "../shared/Modal";
import Icon from "../shared/Icon";
import ProductImage from "../shared/ProductImage";
import { productImage } from "../../utils/product";
import "./HexAssistant.css";
interface Message {
  role: "user" | "assistant";
  text: string;
  ids?: string[];
  action?: { to: string; label: string };
}
const chips = [
  "Find a shoe under $150",
  "Show New Drops",
  "What is visual search?",
  "Compare Hex Runner and Hex Mono",
];
export default function HexAssistant() {
  const [open, setOpen] = useState(false),
    [input, setInput] = useState(""),
    [messages, setMessages] = useState<Message[]>([
      {
        role: "assistant",
        text: "Welcome to HEX. Tell me a style or a budget, and I'll help you explore the collection.",
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
          <span className="eyebrow">PRODUCT ASSISTANT</span>
          <h2>Find your next move.</h2>
          <div className="assistant-history" ref={history} aria-live="polite">
            {messages.map((message, i) => (
              <div className={`assistant-message ${message.role}`} key={i}>
                <p>{message.text}</p>
                {message.action && (
                  <Link to={message.action.to} onClick={close}>
                    {message.action.label}
                  </Link>
                )}
                {message.ids?.map((id) => {
                  const product = products.find((p) => p.id === id);
                  return product ? (
                    <Link
                      key={id}
                      to={`/product/${encodeURIComponent(id)}`}
                      onClick={close}
                      className="assistant-product"
                    >
                      <ProductImage
                        src={productImage(product)}
                        productId={id}
                        sizes="62px"
                        name={productName(product)}
                      />
                      <span>
                        {productName(product)}
                        <small>{displayPrice(product)}</small>
                      </span>
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
          <p className="assistant-disclosure">
            Catalog-based assistant · Advanced AI agent planned
          </p>
        </Modal>
      )}
    </>
  );
}
