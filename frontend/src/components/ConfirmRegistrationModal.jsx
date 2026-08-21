import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as registrationsApi from "../api/registrationsApi";
import { formatTime12Hour } from "../utils/formatTime";
import SpotsGauge from "./SpotsGauge";
import "../styles/confirm-registration-modal.css";

export default function ConfirmRegistrationModal({ activity, onClose, onSuccess }) {
  const { token } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function handleConfirm() {
    setSubmitting(true);
    setError(null);
    try {
      await registrationsApi.createRegistration(activity.id, token);
      setSuccess(true);
      onSuccess(activity.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        {success ? (
          <>
            <p className="modal-success">You're registered for "{activity.title}"!</p>
            <div className="modal-actions">
              <Link to="/registrations" className="modal-link-button" onClick={onClose}>
                View My Registrations
              </Link>
              <button type="button" className="modal-secondary-button" onClick={onClose}>
                Done
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>Confirm Registration</h2>
            <p className="modal-description">
              You're about to register for <strong>{activity.title}</strong>.
            </p>

            <dl className="modal-details">
              <div>
                <dt>Date</dt>
                <dd>{activity.activityDate} at {formatTime12Hour(activity.activityTime)}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{activity.location}</dd>
              </div>
              <div className="modal-details-gauge">
                <dt>Spots</dt>
                <dd>
                  <SpotsGauge registeredCount={activity.registeredCount} capacity={activity.capacity} />
                </dd>
              </div>
            </dl>

            {error && <p className="modal-error">{error}</p>}

            <div className="modal-actions">
              <button
                type="button"
                className="modal-confirm-button"
                disabled={submitting}
                onClick={handleConfirm}
              >
                {submitting ? "Registering..." : "Confirm Registration"}
              </button>
              <button
                type="button"
                className="modal-secondary-button"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}