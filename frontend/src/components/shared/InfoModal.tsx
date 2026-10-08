import { useRef } from "react";
import useModal from "../../hooks/useModal";
import "./InfoModal.css";
export type InfoTopic =
  | "about"
  | "careers"
  | "contact"
  | "sizing"
  | "returns"
  | "shipping"
  | "care"
  | "faq"
  | "privacy"
  | "terms"
  | "cookies";
const content: Record<
  InfoTopic,
  {
    title: string;
    body: string;
  }
> = {
  about: {
    title: "About HEXSHOES",
    body: "HEXSHOES is a modern footwear experience built around movement, design and intelligent technology.",
  },
  careers: { title: "Careers", body: "There are currently no open roles." },
  contact: {
    title: "Contact",
    body: "Contact details will be published before the store launches.",
  },
  sizing: {
    title: "Sizing Guide",
    body: "Verified product measurements and size availability will be published before purchasing becomes available.",
  },
  returns: {
    title: "Returns",
    body: "The 30-day returns policy will be finalized before the store launches.",
  },
  shipping: {
    title: "Shipping",
    body: "Shipping coverage, delivery times and eligibility will be confirmed before the store launches.",
  },
  care: {
    title: "Product Care",
    body: "Product-specific care instructions will be published with the collection.",
  },
  faq: {
    title: "Frequently Asked Questions",
    body: "You can explore real catalog products and use visual search now. Cart and demo checkout are available. Firebase account activation and live payments are pending.",
  },
  privacy: {
    title: "Privacy",
    body: "The final privacy policy is in preparation. Visual search sends your uploaded image to the local AI service for processing. Newsletter emails are not stored.",
  },
  terms: {
    title: "Terms",
    body: "Store terms will be finalized before purchasing becomes available.",
  },
  cookies: {
    title: "Cookies",
    body: "Cookie preferences and the final cookie policy are planned for the store launch.",
  },
};
export default function InfoModal({
  topic,
  onClose,
}: {
  topic: InfoTopic;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useModal(ref, onClose);
  return (
    <div
      className="modal-overlay open info-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="info-box"
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="info-title"
      >
        <button
          className="modal-close"
          aria-label="Close information"
          onClick={onClose}
        >
          −
        </button>
        <h3 id="info-title">{content[topic].title}</h3>
        <div className="info-body">
          <p>{content[topic].body}</p>
        </div>
      </div>
    </div>
  );
}
