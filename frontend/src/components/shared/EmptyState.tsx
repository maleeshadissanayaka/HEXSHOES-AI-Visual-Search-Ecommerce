import { Link } from "react-router-dom";
export default function EmptyState({
  title,
  copy,
  action = "Explore the collection",
  to = "/shop",
  headingLevel = 2,
}: {
  title: string;
  copy: string;
  action?: string;
  to?: string;
  headingLevel?: 1 | 2;
}) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return (
    <div className="empty-state">
      <span className="eyebrow">HEXSHOES</span>
      <img
        className="empty-state-image"
        src="/presentation/products/runner.webp"
        alt=""
        loading="lazy"
      />
      <Heading>{title}</Heading>
      <p>{copy}</p>
      <Link className="btn btn-solid" to={to}>
        {action}
      </Link>
    </div>
  );
}
