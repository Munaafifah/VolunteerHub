import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useMyRegisteredActivityIds } from "../hooks/useMyRegisteredActivityIds";
import * as activitiesApi from "../api/activitiesApi";
import SpotsGauge from "../components/SpotsGauge";
import ConfirmRegistrationModal from "../components/ConfirmRegistrationModal";
import "../styles/activities.css";
import { formatTime12Hour } from "../utils/formatTime";


const CATEGORIES = ["Environment", "Health", "Education", "Animal Welfare", "Community"];
const SORT_OPTIONS = [
  { value: "activityDate", label: "Date" },
  { value: "title", label: "Title" },
  { value: "capacity", label: "Capacity" }
];
const PAGE_SIZE = 6;

function getRegistrationState(activity) {
  const spotsLeft = activity.capacity - activity.registeredCount;
  const isFull = spotsLeft <= 0;
  const deadlinePassed = new Date(activity.registrationDeadline) < new Date(new Date().toDateString());
  const canRegister = activity.status === "ACTIVE" && !isFull && !deadlinePassed;
  return { isFull, deadlinePassed, canRegister };
}

export default function ActivitiesPage() {
  const { token } = useAuth();
  const { registeredActivityIds, markAsRegistered } = useMyRegisteredActivityIds();

  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("activityDate");
  const [direction, setDirection] = useState("asc");
  const [page, setPage] = useState(0);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [relatedActivities, setRelatedActivities] = useState([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

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

  useEffect(() => {
    if (data && data.content.length > 0) {
      const stillOnPage = data.content.some((a) => a.id === selectedActivity?.id);
      if (!stillOnPage) {
        setSelectedActivity(data.content[0]);
      }
    } else {
      setSelectedActivity(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (!selectedActivity) {
      setRelatedActivities([]);
      return;
    }

    let ignore = false;

    async function loadRelated() {
      try {
        const result = await activitiesApi.getPagedActivities(
          {
            category: selectedActivity.category,
            status: "ACTIVE",
            sortBy: "activityDate",
            direction: "asc",
            page: 0,
            size: 4
          },
          token
        );
        if (!ignore) {
          setRelatedActivities(
            result.content.filter((a) => a.id !== selectedActivity.id).slice(0, 3)
          );
        }
      } catch {
        if (!ignore) {
          setRelatedActivities([]);
        }
      }
    }

    loadRelated();

    return () => {
      ignore = true;
    };
  }, [selectedActivity?.id, selectedActivity?.category, token]);

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

  const isAlreadyRegistered = selectedActivity
    ? registeredActivityIds.has(selectedActivity.id)
    : false;

  const registrationState = selectedActivity
    ? getRegistrationState(selectedActivity)
    : { isFull: false, deadlinePassed: false, canRegister: false };

  const canRegister = registrationState.canRegister && !isAlreadyRegistered;

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
          <div className="activities-split">
            <div className="activities-list">
              {data.content.map((activity) => (
                <button
                  key={activity.id}
                  type="button"
                  className={`activity-row${
                    activity.id === selectedActivity?.id ? " activity-row-selected" : ""
                  }`}
                  onClick={() => setSelectedActivity(activity)}
                >
                  <span className="activity-row-info">
                    <span className="activity-row-badge">{activity.category}</span>
                    <span className="activity-row-title">{activity.title}</span>
                  </span>
                  <SpotsGauge
                    registeredCount={activity.registeredCount}
                    capacity={activity.capacity}
                  />
                </button>
              ))}
            </div>

            <div className="activity-detail-panel">
              {selectedActivity ? (
                <>
                  <span className="activity-category">{selectedActivity.category}</span>
                  <h2>{selectedActivity.title}</h2>

                  <div className="activity-detail-gauge">
                    <SpotsGauge
                      registeredCount={selectedActivity.registeredCount}
                      capacity={selectedActivity.capacity}
                    />
                  </div>

                  <div className="activity-detail-stats">
                    <div className="activity-detail-stat">
                      <span className="activity-detail-stat-label">Location</span>
                      <span className="activity-detail-stat-value">{selectedActivity.location}</span>
                    </div>
                    <div className="activity-detail-stat">
                      <span className="activity-detail-stat-label">Date</span>
                      <span className="activity-detail-stat-value">
                        {selectedActivity.activityDate} at {formatTime12Hour(selectedActivity.activityTime)}
                      </span>
                    </div>
                    <div className="activity-detail-stat">
                      <span className="activity-detail-stat-label">Deadline</span>
                      <span className="activity-detail-stat-value">
                        {selectedActivity.registrationDeadline}
                      </span>
                    </div>
                  </div>

                  <p className="activity-detail-description">{selectedActivity.description}</p>

                  {isAlreadyRegistered && (
                    <p className="activity-detail-notice activity-detail-notice-success">
                      You're already registered for this activity.
                    </p>
                  )}

                  {!isAlreadyRegistered && !registrationState.canRegister && (
                    <p className="activity-detail-notice">
                      {selectedActivity.status !== "ACTIVE" &&
                        "This activity is not currently open for registration."}
                      {selectedActivity.status === "ACTIVE" &&
                        registrationState.isFull &&
                        "This activity is full."}
                      {selectedActivity.status === "ACTIVE" &&
                        !registrationState.isFull &&
                        registrationState.deadlinePassed &&
                        "The registration deadline has passed."}
                    </p>
                  )}

                  <button
                    type="button"
                    className="activity-detail-register"
                    disabled={!canRegister}
                    onClick={() => setShowRegisterModal(true)}
                  >
                    {isAlreadyRegistered ? "Already registered" : "Register for this activity"}
                  </button>

                  {relatedActivities.length > 0 && (
                    <div className="activity-related">
                      <p className="activity-related-label">
                        Other {selectedActivity.category} activities
                      </p>
                      {relatedActivities.map((related) => (
                        <button
                          key={related.id}
                          type="button"
                          className="activity-related-item"
                          onClick={() => setSelectedActivity(related)}
                        >
                          {related.title} →
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="activity-detail-empty">Select an activity to see details.</p>
              )}
            </div>
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

      {showRegisterModal && selectedActivity && (
        <ConfirmRegistrationModal
          activity={selectedActivity}
          onClose={() => setShowRegisterModal(false)}
          onSuccess={(activityId) => markAsRegistered(activityId)}
        />
      )}
    </div>
  );
}