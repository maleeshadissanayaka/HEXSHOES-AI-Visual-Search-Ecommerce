import IntelligenceCard from "../ai/IntelligenceCard";
import "./IntelligenceLayer.css";
const features = [
  {
    title: "VISUAL SEARCH",
    subtitle: "Computer vision + CLIP embeddings",
    status: "LIVE",
    copy: "Find similar styles using image embeddings and cosine similarity.",
    icon: "search",
    stages: [],
  },
  {
    title: "AI STYLIST",
    subtitle: "Personalized recommendations",
    status: "IN DEVELOPMENT",
    copy: "A recommendation experience shaped around individual preferences.",
    icon: "chat",
    stages: ["Preferences", "Catalog tools", "Recommendations"],
  },
  {
    title: "DEMAND INSIGHTS",
    subtitle: "Forecasting + product analytics",
    status: "RESEARCH FEATURE",
    copy: "Exploring data-driven insights for future collections.",
    icon: "box",
    stages: ["Historical data", "Baseline models", "Evaluation"],
  },
  {
    title: "PERSONAL FIT INTELLIGENCE",
    subtitle: "Future fit recommendations",
    status: "PLANNED",
    copy: "Researching a more personal approach to finding your fit.",
    icon: "shield",
    stages: ["Sizing data", "Fit feedback", "Validation"],
  },
] as const;
export default function IntelligenceLayer() {
  return (
    <section className="intelligence section-space" id="technology" data-reveal>
      <div className="wrap">
        <div className="section-heading">
          <h2>THE INTELLIGENCE LAYER</h2>
          <span className="eyebrow">
            BUILT WITH AI / ML / DL / DATA SCIENCE
          </span>
        </div>
        <div className="intelligence-grid">
          {features.map((feature) => (
            <IntelligenceCard
              key={feature.title}
              {...feature}
              stages={[...feature.stages]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
