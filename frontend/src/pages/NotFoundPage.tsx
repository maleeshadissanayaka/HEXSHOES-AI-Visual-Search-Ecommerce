import EmptyState from "../components/shared/EmptyState";
export default function NotFoundPage() {
  return (
    <div className="wrap page">
      <span className="eyebrow">404</span>
      <EmptyState
        title="Off the grid."
        copy="This page could not be found. Let?s get you moving again."
        action="BACK TO HOME"
        to="/"
      />
    </div>
  );
}
