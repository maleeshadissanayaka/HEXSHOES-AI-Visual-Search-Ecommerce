import { useState } from "react";
import { validateDemoForm, clearFormValidation } from "../utils/forms";
export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="wrap page contact-page">
      <span className="eyebrow">LET'S CONNECT</span>
      <h1>Start a conversation.</h1>
      <p className="page-intro">
        General enquiries, product support, or a new partnership.
      </p>
      <div className="contact-layout">
        <form
          className="contact-form"
          onChange={(e) => {
            setSubmitted(false);
            clearFormValidation(e.currentTarget);
          }}
          onSubmit={(e) => {
            e.preventDefault();
            if (!validateDemoForm(e.currentTarget)) return;
            setSubmitted(true);
          }}
        >
          <div className="form-row">
            <label>
              Name
              <input name="name" autoComplete="name" required maxLength={100} />
            </label>
            <label>
              Email
              <input type="email" name="email" autoComplete="email" required />
            </label>
          </div>
          <label>
            Subject
            <select name="subject" required defaultValue="">
              <option value="" disabled>
                Select an enquiry type
              </option>
              <option>General enquiries</option>
              <option>Support</option>
              <option>Partnerships</option>
            </select>
          </label>
          <label>
            Message
            <textarea
              name="message"
              rows={6}
              required
              minLength={10}
              maxLength={4000}
            />
          </label>
          <button type="submit" className="btn btn-solid">
            REVIEW MESSAGE →
          </button>
          <p className="form-help">
            Email delivery is not connected. This form validates your message
            locally and does not send or store it.
          </p>
          {submitted && (
            <p className="form-notice" role="status">
              Message form demo — delivery integration pending. Your message
              passed validation. It has not been sent.
            </p>
          )}
        </form>
        <aside className="contact-details">
          {[
            ["General enquiries", "Questions about HEXSHOES and the platform."],
            ["Support", "Product information, sizing and discovery."],
            [
              "Partnerships",
              "Collaborations in footwear, design and intelligent retail.",
            ],
          ].map(([title, copy]) => (
            <div key={title}>
              <h2>{title}</h2>
              <p>{copy}</p>
            </div>
          ))}
          <p className="form-help">
            Contact channels and delivery integration are being prepared.
          </p>
        </aside>
      </div>
    </div>
  );
}
