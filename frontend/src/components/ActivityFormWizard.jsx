import { useState } from "react";

const CATEGORY_OPTIONS = ["Environment", "Health", "Education", "Animal Welfare", "Community", "Fundraising"];
const STATUS_OPTIONS = ["ACTIVE", "INACTIVE"];

export const emptyActivityForm = {
  title: "",
  description: "",
  category: "",
  location: "",
  activityDate: "",
  activityTime: "",
  registrationDeadline: "",
  capacity: "",
  status: "ACTIVE"
};

export default function ActivityFormWizard({
  mode = "create",
  initialValues = emptyActivityForm,
  onSubmit,
  saving = false,
  serverError = null,
  successMessage = null
}) {
  const [formValues, setFormValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState({});

  const isEditMode = mode === "edit";

  function updateField(fieldName, value) {
    setFormValues((current) => ({ ...current, [fieldName]: value }));
    setFieldErrors((current) => ({ ...current, [fieldName]: null }));
  }

  function validate() {
    const errors = {};

    if (!formValues.title.trim()) errors.title = "Title is required.";
    if (!formValues.description.trim()) errors.description = "Description is required.";
    if (!formValues.category.trim()) errors.category = "Category is required.";
    if (!formValues.location.trim()) errors.location = "Location is required.";
    if (!formValues.activityDate) errors.activityDate = "Activity date is required.";
    if (!formValues.activityTime.trim()) errors.activityTime = "Activity time is required.";
    if (!formValues.registrationDeadline) errors.registrationDeadline = "Registration deadline is required.";

    const capacityNumber = Number(formValues.capacity);
    if (!formValues.capacity || Number.isNaN(capacityNumber) || capacityNumber < 1) {
      errors.capacity = "Capacity must be at least 1.";
    }

    if (isEditMode && !STATUS_OPTIONS.includes(formValues.status)) {
      errors.status = "Status must be ACTIVE or INACTIVE.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const payload = {
      title: formValues.title.trim(),
      description: formValues.description.trim(),
      category: formValues.category.trim(),
      location: formValues.location.trim(),
      activityDate: formValues.activityDate,
      activityTime: formValues.activityTime.trim(),
      registrationDeadline: formValues.registrationDeadline,
      capacity: Number(formValues.capacity)
    };

    if (isEditMode) {
      payload.status = formValues.status;
    }

    await onSubmit(payload);
  }

  return (
    <form className="activity-form" onSubmit={handleSubmit} noValidate>
      {serverError && <p className="form-message form-error">{serverError}</p>}
      {successMessage && <p className="form-message form-success">{successMessage}</p>}

      <label htmlFor="title">
        Title
        <input
          id="title"
          value={formValues.title}
          onChange={(event) => updateField("title", event.target.value)}
        />
        {fieldErrors.title && <span className="field-error">{fieldErrors.title}</span>}
      </label>

      <label htmlFor="description">
        Description
        <textarea
          id="description"
          rows={4}
          value={formValues.description}
          onChange={(event) => updateField("description", event.target.value)}
        />
        {fieldErrors.description && <span className="field-error">{fieldErrors.description}</span>}
      </label>

      <div className="activity-form-grid">
        <label htmlFor="category">
          Category
          <select
            id="category"
            value={formValues.category}
            onChange={(event) => updateField("category", event.target.value)}
          >
            <option value="">Select a category</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {fieldErrors.category && <span className="field-error">{fieldErrors.category}</span>}
        </label>

        <label htmlFor="location">
          Location
          <input
            id="location"
            value={formValues.location}
            onChange={(event) => updateField("location", event.target.value)}
          />
          {fieldErrors.location && <span className="field-error">{fieldErrors.location}</span>}
        </label>

        <label htmlFor="activityDate">
          Activity Date
          <input
            id="activityDate"
            type="date"
            value={formValues.activityDate}
            onChange={(event) => updateField("activityDate", event.target.value)}
          />
          {fieldErrors.activityDate && <span className="field-error">{fieldErrors.activityDate}</span>}
        </label>

        <label htmlFor="activityTime">
          Activity Time
          <input
            id="activityTime"
            type="time"
            value={formValues.activityTime}
            onChange={(event) => updateField("activityTime", event.target.value)}
          />
          {fieldErrors.activityTime && <span className="field-error">{fieldErrors.activityTime}</span>}
        </label>

        <label htmlFor="registrationDeadline">
          Registration Deadline
          <input
            id="registrationDeadline"
            type="date"
            value={formValues.registrationDeadline}
            onChange={(event) => updateField("registrationDeadline", event.target.value)}
          />
          {fieldErrors.registrationDeadline && <span className="field-error">{fieldErrors.registrationDeadline}</span>}
        </label>

        <label htmlFor="capacity">
          Capacity
          <input
            id="capacity"
            type="number"
            min="1"
            value={formValues.capacity}
            onChange={(event) => updateField("capacity", event.target.value)}
          />
          {fieldErrors.capacity && <span className="field-error">{fieldErrors.capacity}</span>}
        </label>

        {isEditMode && (
          <label htmlFor="status">
            Status
            <select
              id="status"
              value={formValues.status}
              onChange={(event) => updateField("status", event.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {fieldErrors.status && <span className="field-error">{fieldErrors.status}</span>}
          </label>
        )}
      </div>

      <button type="submit" className="activity-form-submit" disabled={saving}>
        {saving ? "Saving..." : isEditMode ? "Update Activity" : "Create Activity"}
      </button>
    </form>
  );
}