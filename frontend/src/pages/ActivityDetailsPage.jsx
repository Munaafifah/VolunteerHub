import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as activitiesApi from "../api/activitiesApi";
import "../styles/activity-details.css";

export default function ActivityDetailsPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadActivity() {
      setLoading(true);
      setError(null);
      try {
        const result = await activitiesApi.getActivityById(id, token);
        if (!ignore) {
          setActivity(result);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadActivity();

    return () => {
      ignore = true;
    };
  }, [id, token]);

  if (loading) {
    return <p className="details-status">Loading activity...</p>;
  }

  if (error) {
    return (
      <div className="details-status details-error">
        <p>{error}</p>
        <Link to="/activities">Back to Activities</Link>
      </div>
    );
  }

  if (!activity) {
    return null;
  }

  const spotsLeft = activity.capacity - activity.registeredCount;
  const isFull = spotsLeft <= 0;
  const deadlinePassed = new Date(activity.registrationDeadline) < new Date(new Date().toDateString());
  const canRegister = activity.status === "ACTIVE" && !isFull && !deadlinePassed;

  return (
    <div className="activity-details-page">
      <Link to="/activities" className="back-link">← Back to Activities</Link>

      <div className="details-card">
        <span className="activity-category">{activity.category}</span>
        <h1>{activity.title}</h1>
        <p className="details-description">{activity.description}</p>

        <dl className="details-list">
          <div>
            <dt>Location</dt>
            <dd>{activity.location}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{activity.activityDate} at {activity.activityTime}</dd>
          </div>
          <div>
            <dt>Registration deadline</dt>
            <dd>{activity.registrationDeadline}</dd>
          </div>
          <div>
            <dt>Spots</dt>
            <dd>{activity.registeredCount} / {activity.capacity} filled</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{activity.status}</dd>
          </div>
        </dl>

        {!canRegister && (
          <p className="details-notice">
            {activity.status !== "ACTIVE" && "This activity is not currently open for registration."}
            {activity.status === "ACTIVE" && isFull && "This activity is full."}
            {activity.status === "ACTIVE" && !isFull && deadlinePassed && "The registration deadline has passed."}
          </p>
        )}

        <button
          type="button"
          className="register-button"
          disabled={!canRegister}
          onClick={() => navigate(`/activities/${id}/register`)}
        >
          Register for this activity
        </button>
      </div>
    </div>
  );
}