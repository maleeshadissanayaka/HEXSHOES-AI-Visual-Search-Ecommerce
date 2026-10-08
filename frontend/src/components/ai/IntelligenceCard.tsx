import { Link } from "react-router-dom";
import Icon from "../shared/Icon";
import { catalogImage } from "../../services/aiSearch";
interface Props {
  title: string;
  subtitle: string;
  status: string;
  copy: string;
  icon: "search" | "chat" | "box" | "shield" | "heart";
  stages: string[];
}
export default function IntelligenceCard({
  title,
  subtitle,
  status,
  copy,
  icon,
  stages,
}: Props) {
  const live = status === "LIVE";
  return (
    <article className="intelligence-card">
      <div className="intelligence-card-heading">
        <span className="intelligence-icon">
          <Icon name={icon} />
        </span>
        <h3>{title}</h3>
      </div>
      <h4>{subtitle}</h4>
      <p>{copy}</p>
      {live ? (
        <div className="intelligence-preview">
          <img
            src={catalogImage("shoe5.jpg")}
            alt="An actual shoe image from the AI embedding catalog"
            loading="lazy"
          />
          <span>CATALOG SAMPLE / CLIP</span>
        </div>
      ) : (
        <div
          className="intelligence-concept"
          aria-label={`${title} roadmap stages`}
        >
          {stages.map((stage, i) => (
            <div key={stage}>
              <span>0{i + 1}</span>
              <strong>{stage}</strong>
            </div>
          ))}
        </div>
      )}
      <div className="intelligence-card-bottom">
        <span className={`feature-status${live ? " implemented" : ""}`}>
          {status}
        </span>
        <Link
          to={live ? "/visual-search" : "/technology#roadmap"}
          aria-label={
            live
              ? "Try visual search"
              : `Explore ${title.toLowerCase()} roadmap`
          }
        >
          <Icon name="arrow" />
        </Link>
      </div>
    </article>
  );
}
