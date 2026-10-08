import Modal from "./Modal";
import "./InfoModal.css";
export type InfoTopic =
  | "careers"
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
  careers: {
    title: "Careers",
    body: "Verified career opportunities have not been published.",
  },
  sizing: {
    title: "Sizing Guide",
    body: "Verified product measurements and size availability will be published before purchasing becomes available.",
  },
  returns: {
    title: "Returns",
    body: "Return eligibility and policy details will be confirmed before live purchasing.",
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
  return (
    <Modal title={content[topic].title} onClose={onClose} className="info-box">
      <h2>{content[topic].title}</h2>
      <div className="info-body">
        <p>{content[topic].body}</p>
      </div>
    </Modal>
  );
}
