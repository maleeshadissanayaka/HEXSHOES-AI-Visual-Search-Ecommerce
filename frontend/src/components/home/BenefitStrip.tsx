import Icon from "../shared/Icon";
import "./BrandSections.css";
export default function BenefitStrip() {
  return (
    <section className="benefits" aria-label="Shopping benefits">
      <div className="wrap benefits-grid">
        {(
          [
            ["truck", "FIND YOUR FORM", "Explore the collection"],
            ["search", "AI VISUAL SEARCH", "Ranked catalog references"],
            ["shield", "EVERYDAY / BEYOND", "Built for your next move"],
            ["box", "CONSIDERED DESIGN", "Movement meets technology"],
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
