import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import * as reportsApi from "../api/reportsApi";
import "../styles/admin-reports.css";

const LIMIT_OPTIONS = [3, 5, 10];

export default function AdminReportsPage() {
  const { token } = useAuth();

  const [limit, setLimit] = useState(5);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await reportsApi.getPopularActivities(limit, token);
      setActivities(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [limit, token]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const maxCount = activities.length > 0
    ? Math.max(...activities.map((a) => a.registrationCount))
    : 0;

  return (
    <div className="admin-reports-page">
      <div className="admin-reports-header">
        <h1>Most Popular Activities</h1>
        <label className="limit-select">
          Show top
          <select value={limit} onChange={(event) => setLimit(Number(event.target.value))}>
            {LIMIT_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      {loading && <p className="admin-reports-status">Loading report...</p>}

      {!loading && error && (
        <p className="admin-reports-status admin-reports-error">{error}</p>
      )}

      {!loading && !error && activities.length === 0 && (
        <p className="admin-reports-status">No registrations yet — nothing to report.</p>
      )}

      {!loading && !error && activities.length > 0 && (
        <div className="report-list">
          {activities.map((activity, index) => (
            <div className="report-row" key={activity.activityId}>
              <div className="report-rank">#{index + 1}</div>
              <div className="report-details">
                <strong>{activity.title}</strong>
                <span className="report-meta">{activity.category} · {activity.location}</span>
                <div className="report-bar-track">
                  <div
                    className="report-bar-fill"
                    style={{ width: maxCount > 0 ? `${(activity.registrationCount / maxCount) * 100}%` : "0%" }}
                  />
                </div>
              </div>
              <div className="report-count">{activity.registrationCount}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}