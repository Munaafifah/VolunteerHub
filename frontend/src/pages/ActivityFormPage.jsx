import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import ActivityFormWizard, { emptyActivityForm } from "../components/ActivityFormWizard";
import { useAuth } from "../context/AuthContext";
import * as activitiesApi from "../api/activitiesApi";
import "../styles/activity-form.css";

export default function ActivityFormPage() {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const isEditMode = Boolean(activityId);

  const [initialValues, setInitialValues] = useState(emptyActivityForm);
  const [loading, setLoading] = useState(isEditMode);
  const [loadError, setLoadError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadActivityForEdit() {
      if (!activityId) {
        return;
      }

      setLoading(true);
      setLoadError(null);
      try {
        const activity = await activitiesApi.getActivityById(activityId, token);
        if (!ignore) {
          setInitialValues({
            title: activity.title ?? "",
            description: activity.description ?? "",
            category: activity.category ?? "",
            location: activity.location ?? "",
            activityDate: activity.activityDate ?? "",
            activityTime: activity.activityTime ?? "",
            registrationDeadline: activity.registrationDeadline ?? "",
            capacity: activity.capacity ?? "",
            status: activity.status ?? "ACTIVE"
          });
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

    loadActivityForEdit();

    return () => {
      ignore = true;
    };
  }, [activityId, token]);

  async function handleSubmit(payload) {
    setSaving(true);
    setServerError(null);
    setSuccessMessage(null);

    try {
      if (isEditMode) {
        await activitiesApi.updateActivity(activityId, payload, token);
        setSuccessMessage("Activity updated successfully.");
      } else {
        await activitiesApi.createActivity(payload, token);
        setSuccessMessage("Activity created successfully.");
      }
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="activity-form-status">Loading activity...</p>;
  }

  if (loadError) {
    return (
      <div className="activity-form-status activity-form-error">
        <p>{loadError}</p>
        <Link to="/admin/activities">Back to Manage Activities</Link>
      </div>
    );
  }

  return (
    <div className="activity-form-page">
      <div className="activity-form-header">
        <h1>{isEditMode ? "Edit Activity" : "Create Activity"}</h1>
        <div className="activity-form-header-actions">
          <button type="button" onClick={() => navigate("/admin/activities")}>
            Back to Manage Activities
          </button>
          {successMessage && (
            <button type="button" onClick={() => navigate("/admin/activities")}>
              View Activities
            </button>
          )}
        </div>
      </div>

      <ActivityFormWizard
        key={activityId || "create"}
        mode={isEditMode ? "edit" : "create"}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        saving={saving}
        serverError={serverError}
        successMessage={successMessage}
      />
    </div>
  );
}