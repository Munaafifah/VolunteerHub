import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { HeartHandshake, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/app-shell.css";

export default function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  function navClass({ isActive }) {
    return isActive ? "nav-link active" : "nav-link";
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-title-group">
          <HeartHandshake className="app-title-icon" size={22} aria-hidden="true" />
          <span className="app-title">VolunteerHub</span>
        </div>

        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <nav className={mobileMenuOpen ? "app-nav app-nav-open" : "app-nav"}>
        <NavLink to="/activities" className={navClass} onClick={closeMobileMenu}>
          Activities
        </NavLink>
        <NavLink to="/registrations" className={navClass} onClick={closeMobileMenu}>
          My Registrations
        </NavLink>

        {user?.role === "ADMIN" && (
          <>
            <NavLink to="/admin/activities" className={navClass} onClick={closeMobileMenu}>
              Manage Activities
            </NavLink>
            <NavLink to="/admin/registrations" className={navClass} onClick={closeMobileMenu}>
              All Registrations
            </NavLink>
            <NavLink to="/admin/reports" className={navClass} onClick={closeMobileMenu}>
              Reports
            </NavLink>
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