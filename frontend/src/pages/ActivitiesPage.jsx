import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as activitiesApi from "../api/activitiesApi";
import "../styles/activities.css";

const CATEGORIES = ["Environment", "Health", "Education", "Animal Welfare", "Community"];
const SORT_OPTIONS = [
  { value: "activityDate", label: "Date" },
  { value: "title", label: "Title" },
  { value: "capacity", label: "Capacity" }
];
const PAGE_SIZE = 6;

export default function ActivitiesPage() {
  const { token } = useAuth();

  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("activityDate");
  const [direction, setDirection] = useState("asc");
  const [page, setPage] = useState(0);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await activitiesApi.getPagedActivities(
        {
          keyword,
          category,
          status: "ACTIVE",
          sortBy,
          direction,
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
  }, [keyword, category, sortBy, direction, page, token]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  function handleSearchSubmit(event) {
    event.preventDefault();
    setPage(0);
    setKeyword(keywordInput.trim());
  }

  function handleCategoryChange(event) {
    setPage(0);
    setCategory(event.target.value);
  }

  function handleSortByChange(event) {
    setPage(0);
    setSortBy(event.target.value);
  }

  function handleDirectionToggle() {
    setPage(0);
    setDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  }

  function goToPreviousPage() {
    setPage((prev) => Math.max(prev - 1, 0));
  }

  function goToNextPage() {
    if (data && page < data.totalPages - 1) {
      setPage((prev) => prev + 1);
    }
  }

  return (
    <div className="activities-page">
      <h1>Activities</h1>

      <form className="activities-filters" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search by title..."
          value={keywordInput}
          onChange={(event) => setKeywordInput(event.target.value)}
        />
        <button type="submit">Search</button>

        <select value={category} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select value={sortBy} onChange={handleSortByChange}>
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>Sort by {opt.label}</option>
          ))}
        </select>

        <button type="button" onClick={handleDirectionToggle}>
          {direction === "asc" ? "Ascending ↑" : "Descending ↓"}
        </button>
      </form>

      {loading && <p className="activities-status">Loading activities...</p>}

      {!loading && error && (
        <p className="activities-status activities-error">{error}</p>
      )}

      {!loading && !error && data && data.content.length === 0 && (
        <p className="activities-status">No activities match your search.</p>
      )}

      {!loading && !error && data && data.content.length > 0 && (
        <>
          <div className="activities-grid">
            {data.content.map((activity) => (
              <div className="activity-card" key={activity.id}>
                <h3>{activity.title}</h3>
                <p className="activity-category">{activity.category}</p>
                <p>{activity.description}</p>
                <dl>
                  <div>
                    <dt>Location</dt>
                    <dd>{activity.location}</dd>
                  </div>
                  <div>
                    <dt>Date</dt>
                    <dd>{activity.activityDate} at {activity.activityTime}</dd>
                  </div>
                  <div>
                    <dt>Deadline</dt>
                    <dd>{activity.registrationDeadline}</dd>
                  </div>
                  <div>
                    <dt>Spots</dt>
                    <dd>{activity.registeredCount} / {activity.capacity}</dd>
                  </div>
                </dl>
                <Link to={`/activities/${activity.id}`} className="view-details-link">
                  View Details →
                </Link>
              </div>
            ))}
          </div>

          <div className="activities-pagination">
            <button type="button" onClick={goToPreviousPage} disabled={page === 0}>
              Previous
            </button>
            <span>
              Page {data.number + 1} of {data.totalPages}
            </span>
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