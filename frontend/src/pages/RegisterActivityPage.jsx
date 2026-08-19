import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as activitiesApi from "../api/activitiesApi";
import * as registrationsApi from "../api/registrationsApi";
import "../styles/activity-details.css";

export default function RegisterActivityPage() {
  const { id } = useParams();
  const { token } = useAuth();

  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadActivity() {
      setLoading(true);
      setLoadError(null);
      try {
        const result = await activitiesApi.getActivityById(id, token);
        if (!ignore) {
          setActivity(result);
        }
      } catch (err) {
        if (!ignore) {
          setLoadError(err.message);
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

  async function handleConfirm() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await registrationsApi.createRegistration(id, token);
      setSuccess(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="details-status">Loading activity...</p>;
  }

  if (loadError) {
    return (
      <div className="details-status details-error">
        <p>{loadError}</p>
        <Link to="/activities">Back to Activities</Link>
      </div>
    );
  }

  if (!activity) {
    return null;
  }

  if (success) {
    return (
      <div className="activity-details-page">
        <div className="details-card">
          <p className="register-success">You're registered for "{activity.title}"!</p>
          <div className="register-actions">
            <Link to="/registrations" className="register-button-link">View My Registrations</Link>
            <Link to="/activities" className="back-link">Back to Activities</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-details-page">
      <Link to={`/activities/${id}`} className="back-link">← Back to Details</Link>

      <div className="details-card">
        <h1>Confirm Registration</h1>
        <p className="details-description">
          You're about to register for <strong>{activity.title}</strong>.
        </p>

        <dl className="details-list">
          <div>
            <dt>Date</dt>
            <dd>{activity.activityDate} at {activity.activityTime}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{activity.location}</dd>
          </div>
          <div>
            <dt>Spots</dt>
            <dd>{activity.registeredCount} / {activity.capacity} filled</dd>
          </div>
        </dl>

        {submitError && <p className="details-notice details-notice-error">{submitError}</p>}

        <button
          type="button"
          className="register-button"
          disabled={submitting}
          onClick={handleConfirm}
        >
          {submitting ? "Registering..." : "Confirm Registration"}
        </button>
      </div>
    </div>
  );
}