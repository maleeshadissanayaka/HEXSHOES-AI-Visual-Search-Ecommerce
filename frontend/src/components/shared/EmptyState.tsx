import { Link } from "react-router-dom";
export default function EmptyState({
  title,
  copy,
  action = "Explore the collection",
  to = "/shop",
}: {
  title: string;
  copy: string;
  action?: string;
  to?: string;
}) {
  return (
    <div className="empty-state">
      <span className="eyebrow">HEXSHOES</span>
      <h2>{title}</h2>
      <p>{copy}</p>
      <Link className="btn btn-solid" to={to}>
        {action}
      </Link>
    </div>
  );
}
