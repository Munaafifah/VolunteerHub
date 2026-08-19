import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as activitiesApi from "../api/activitiesApi";
import "../styles/admin-activities.css";

const STATUS_FILTERS = [
  { value: "", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" }
];
const PAGE_SIZE = 8;

export default function AdminActivitiesPage() {
  const { token } = useAuth();

  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [deactivatingId, setDeactivatingId] = useState(null);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await activitiesApi.getPagedActivities(
        {
          status,
          sortBy: "activityDate",
          direction: "asc",
          page,
          size: PAGE_SIZE
        },
        token
      );
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [status, page, token]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  function handleStatusChange(event) {
    setPage(0);
    setStatus(event.target.value);
  }

  function goToPreviousPage() {
    setPage((prev) => Math.max(prev - 1, 0));
  }

  function goToNextPage() {
    if (data && page < data.totalPages - 1) {
      setPage((prev) => prev + 1);
    }
  }

  async function handleDeactivate(id, title) {
    const confirmed = window.confirm(`Deactivate "${title}"? Volunteers won't be able to register once it's inactive.`);
    if (!confirmed) {
      return;
    }

    setDeactivatingId(id);
    setActionError(null);
    try {
      await activitiesApi.deactivateActivity(id, token);
      await fetchActivities();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setDeactivatingId(null);
    }
  }

  return (
    <div className="admin-activities-page">
      <div className="admin-activities-header">
        <h1>Manage Activities</h1>
        <Link to="/admin/activities/new" className="new-activity-button">+ New Activity</Link>
      </div>

      <div className="admin-activities-filters">
        <select value={status} onChange={handleStatusChange}>
          {STATUS_FILTERS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {actionError && <p className="admin-activities-status admin-activities-error">{actionError}</p>}

      {loading && <p className="admin-activities-status">Loading activities...</p>}

      {!loading && error && (
        <p className="admin-activities-status admin-activities-error">{error}</p>
      )}

      {!loading && !error && data && data.content.length === 0 && (
        <p className="admin-activities-status">No activities found.</p>
      )}

      {!loading && !error && data && data.content.length > 0 && (
        <>
          <div className="admin-activities-table">
            <div className="admin-activities-row admin-activities-row-header">
              <span>Title</span>
              <span>Category</span>
              <span>Date</span>
              <span>Spots</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {data.content.map((activity) => (
              <div className="admin-activities-row" key={activity.id}>
                <span>{activity.title}</span>
                <span>{activity.category}</span>
                <span>{activity.activityDate}</span>
                <span>{activity.registeredCount} / {activity.capacity}</span>
                <span>
                  <span className={`status-badge status-${activity.status.toLowerCase()}`}>
                    {activity.status}
                  </span>
                </span>
                <span className="admin-activities-actions">
                  <Link to={`/admin/activities/${activity.id}/edit`}>Edit</Link>
                  {activity.status === "ACTIVE" && (
                    <button
                      type="button"
                      disabled={deactivatingId === activity.id}
                      onClick={() => handleDeactivate(activity.id, activity.title)}
                    >
                      {deactivatingId === activity.id ? "..." : "Deactivate"}
                    </button>
                  )}
                </span>
              </div>
            ))}
          </div>

          <div className="admin-activities-pagination">
            <button type="button" onClick={goToPreviousPage} disabled={page === 0}>
              Previous
            </button>
            <span>Page {data.number + 1} of {data.totalPages}</span>
            <button
              type="button"
              onClick={goToNextPage}
              disabled={page >= data.totalPages - 1}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}