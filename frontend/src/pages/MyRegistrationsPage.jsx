import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as registrationsApi from "../api/registrationsApi";
import * as activitiesApi from "../api/activitiesApi";
import "../styles/my-registrations.css";

export default function MyRegistrationsPage() {
  const { token } = useAuth();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelError, setCancelError] = useState(null);

  const loadRegistrations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const myRegistrations = await registrationsApi.getMyRegistrations(token);

      const withActivities = await Promise.all(
        myRegistrations.map(async (registration) => {
          try {
            const activity = await activitiesApi.getActivityById(registration.activityId, token);
            return { ...registration, activity };
          } catch {
            return { ...registration, activity: null };
          }
        })
      );

      withActivities.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));

      setRegistrations(withActivities);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  async function handleCancel(registrationId, activityTitle) {
    const confirmed = window.confirm(`Cancel your registration for "${activityTitle}"?`);
    if (!confirmed) {
      return;
    }

    setCancellingId(registrationId);
    setCancelError(null);
    try {
      await registrationsApi.cancelRegistration(registrationId, token);
      await loadRegistrations();
    } catch (err) {
      setCancelError(err.message);
    } finally {
      setCancellingId(null);
    }
  }

  if (loading) {
    return <p className="registrations-status">Loading your registrations...</p>;
  }

  if (error) {
    return <p className="registrations-status registrations-error">{error}</p>;
  }

  if (registrations.length === 0) {
    return (
      <div className="registrations-status">
        <p>You haven't registered for any activities yet.</p>
        <Link to="/activities">Browse Activities</Link>
      </div>
    );
  }

  return (
    <div className="my-registrations-page">
      <h1>My Registrations</h1>

      {cancelError && <p className="registrations-status registrations-error">{cancelError}</p>}

      <div className="registrations-list">
        {registrations.map((registration) => (
          <div className="registration-card" key={registration.id}>
            <div className="registration-info">
              <h3>{registration.activity ? registration.activity.title : "Activity no longer available"}</h3>
              {registration.activity && (
                <p className="registration-meta">
                  {registration.activity.activityDate} at {registration.activity.activityTime} · {registration.activity.location}
                </p>
              )}
              <p className="registration-meta">
                Registered on {new Date(registration.registeredAt).toLocaleDateString()}
                {registration.status === "CANCELLED" && registration.cancelledAt && (
                  <> · Cancelled on {new Date(registration.cancelledAt).toLocaleDateString()}</>
                )}
              </p>
            </div>

            <div className="registration-actions">
              <span className={`status-badge status-${registration.status.toLowerCase()}`}>
                {registration.status}
              </span>

              {registration.status === "REGISTERED" && (
                <button
                  type="button"
                  className="cancel-button"
                  disabled={cancellingId === registration.id}
                  onClick={() => handleCancel(registration.id, registration.activity?.title || "this activity")}
                >
                  {cancellingId === registration.id ? "Cancelling..." : "Cancel"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}