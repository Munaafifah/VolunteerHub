import { useEffect, useState } from "react";
import "../styles/confirm-registration-modal.css";

export default function ConfirmCancelModal({ activityTitle, onClose, onConfirm }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

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
      await onConfirm();
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <h2>Cancel Registration</h2>
        <p className="modal-description">
          Cancel your registration for <strong>{activityTitle}</strong>?
        </p>

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-actions">
          <button
            type="button"
            className="modal-confirm-button"
            disabled={submitting}
            onClick={handleConfirm}
          >
            {submitting ? "Cancelling..." : "Cancel Registration"}
          </button>
          <button
            type="button"
            className="modal-secondary-button"
            onClick={onClose}
            disabled={submitting}
          >
            Keep Registration
          </button>
        </div>
      </div>
    </div>
  );
}