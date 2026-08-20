import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import * as registrationsApi from "../api/registrationsApi";
import * as usersApi from "../api/usersApi";
import * as activitiesApi from "../api/activitiesApi";
import "../styles/admin-registrations.css";

const STATUS_FILTERS = [
  { value: "", label: "All Statuses" },
  { value: "REGISTERED", label: "Registered" },
  { value: "CANCELLED", label: "Cancelled" }
];

export default function AdminRegistrationsPage() {
  const { token } = useAuth();

  const [registrations, setRegistrations] = useState([]);
  const [usersById, setUsersById] = useState({});
  const [activitiesById, setActivitiesById] = useState({});
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [allRegistrations, allUsers, activitiesPage] = await Promise.all([
        registrationsApi.getAllRegistrations(token),
        usersApi.getAllUsers(token),
        activitiesApi.getPagedActivities(
          { page: 0, size: 200, sortBy: "title", direction: "asc" },
          token
        )
      ]);

      const userMap = {};
      allUsers.forEach((u) => {
        userMap[u.id] = u;
      });

      const activityMap = {};
      activitiesPage.content.forEach((a) => {
        activityMap[a.id] = a;
      });

      const sorted = [...allRegistrations].sort(
        (a, b) => new Date(b.registeredAt) - new Date(a.registeredAt)
      );

      setRegistrations(sorted);
      setUsersById(userMap);
      setActivitiesById(activityMap);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const visibleRegistrations = statusFilter
    ? registrations.filter((r) => r.status === statusFilter)
    : registrations;

  return (
    <div className="admin-registrations-page">
      <div className="admin-registrations-header">
        <h1>All Registrations</h1>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          {STATUS_FILTERS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {loading && <p className="admin-registrations-status">Loading registrations...</p>}

      {!loading && error && (
        <p className="admin-registrations-status admin-registrations-error">{error}</p>
      )}

      {!loading && !error && visibleRegistrations.length === 0 && (
        <p className="admin-registrations-status">No registrations found.</p>
      )}

      {!loading && !error && visibleRegistrations.length > 0 && (
        <div className="admin-registrations-table">
          <div className="admin-registrations-row admin-registrations-row-header">
            <span>User</span>
            <span>Activity</span>
            <span>Status</span>
            <span>Registered</span>
            <span>Cancelled</span>
          </div>

          {visibleRegistrations.map((registration) => {
            const user = usersById[registration.userId];
            const activity = activitiesById[registration.activityId];

            return (
              <div className="admin-registrations-row" key={registration.id}>
                <span>
                  {user ? (
                    <>
                      <strong>{user.name}</strong>
                      <span className="admin-registrations-subtext">{user.email}</span>
                    </>
                  ) : (
                    <span className="admin-registrations-subtext">
                      Unknown user ({registration.userId})
                    </span>
                  )}
                </span>
                <span>
                  {activity ? activity.title : `Unknown activity (${registration.activityId})`}
                </span>
                <span>
                  <span className={`status-badge status-${registration.status.toLowerCase()}`}>
                    {registration.status}
                  </span>
                </span>
                <span>
                  {registration.registeredAt
                    ? new Date(registration.registeredAt).toLocaleString()
                    : "-"}
                </span>
                <span>
                  {registration.cancelledAt
                    ? new Date(registration.cancelledAt).toLocaleString()
                    : "-"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}