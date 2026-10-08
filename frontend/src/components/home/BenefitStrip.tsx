import Icon from "../shared/Icon";
import "./BrandSections.css";
export default function BenefitStrip() {
  return (
    <section className="benefits" aria-label="Shopping benefits">
      <div className="wrap benefits-grid">
        {(
          [
            ["truck", "FREE SHIPPING", "Worldwide orders"],
            ["search", "AI VISUAL SEARCH", "Find your style instantly"],
            ["shield", "30-DAY RETURNS", "Hassle free"],
            ["box", "SMALL BATCH PRODUCTION", "Premium quality"],
          ] as const
        ).map(([icon, title, copy]) => (
          <div className="benefit" key={title}>
            <Icon name={icon} />
            <div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
