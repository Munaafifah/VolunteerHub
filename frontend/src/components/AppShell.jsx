import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { HeartHandshake } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/app-shell.css";

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  function navClass({ isActive }) {
    return isActive ? "nav-link active" : "nav-link";
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-title-group">
          <HeartHandshake className="app-title-icon" size={22} aria-hidden="true" />
          <span className="app-title">VolunteerHub</span>
        </div>
      </header>

      <nav className="app-nav">
        <NavLink to="/activities" className={navClass}>Activities</NavLink>
        <NavLink to="/registrations" className={navClass}>My Registrations</NavLink>

        {user?.role === "ADMIN" && (
          <>
            <NavLink to="/admin/activities" className={navClass}>Manage Activities</NavLink>
            <NavLink to="/admin/registrations" className={navClass}>All Registrations</NavLink>
            <NavLink to="/admin/reports" className={navClass}>Reports</NavLink>
          </>
        )}

        <div className="app-nav-user">
          {user && <span className="app-nav-email">{user.email}</span>}
          <button type="button" className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}