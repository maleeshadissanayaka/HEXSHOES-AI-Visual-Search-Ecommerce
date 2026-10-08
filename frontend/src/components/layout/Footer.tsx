import { Link } from "react-router-dom";
import Icon from "../shared/Icon";
import type { InfoTopic } from "../shared/InfoModal";
import "./Footer.css";
export default function Footer({
  onOpenInfo,
}: {
  onOpenInfo: (topic: InfoTopic) => void;
}) {
  return (
    <footer className="site-footer" id="footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Link to="/" className="foot-mark">
              HEX<strong>SHOES</strong>
            </Link>
            <p>Engineered for what’s next.</p>
          </div>
          <div className="foot-col">
            <h4>SHOP</h4>
            {[
              ["Men", "/men"],
              ["Women", "/women"],
              ["New Drops", "/new-drops"],
              ["Collections", "/shop"],
              ["Find My Shoe", "/visual-search"],
            ].map(([label, href]) => (
              <Link key={label} to={href}>
                {label}
              </Link>
            ))}
          </div>
          <div className="foot-col">
            <h4>SUPPORT</h4>
            {(["sizing", "shipping", "returns", "care", "faq"] as const).map(
              (topic) => (
                <button key={topic} onClick={() => onOpenInfo(topic)}>
                  {topic === "sizing"
                    ? "Sizing Guide"
                    : topic === "faq"
                      ? "FAQ"
                      : topic[0].toUpperCase() + topic.slice(1)}
                </button>
              ),
            )}
          </div>
          <div className="foot-col">
            <h4>COMPANY</h4>
            <Link to="/contact">Contact</Link>
            <Link to="/about">About</Link>
            <Link to="/technology">Technology</Link>
            {(["careers", "privacy"] as const).map((topic) => (
              <button key={topic} onClick={() => onOpenInfo(topic)}>
                {topic === "privacy"
                  ? "Privacy Policy"
                  : topic[0].toUpperCase() + topic.slice(1)}
              </button>
            ))}
          </div>
          <div className="foot-col">
            <h4>FOLLOW US</h4>
            <div className="social-icons">
              <Icon name="instagram" />
              <Icon name="tiktok" />
              <Icon name="video" />
              <Icon name="linkedin" />
            </div>
            <p>
              Instagram / TikTok / YouTube / LinkedIn
              <br />
              Verified channels pending.
            </p>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 HEXSHOES</span>
          <div>
            {(["terms", "privacy", "cookies"] as const).map((topic) => (
              <button key={topic} onClick={() => onOpenInfo(topic)}>
                {topic[0].toUpperCase() + topic.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
