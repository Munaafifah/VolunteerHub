import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>404 — Page not found</h1>
      <Link to="/activities">Back to Activities</Link>
    </div>
  );
}