import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { HeartHandshake } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/activities";

  const GUEST_EMAIL = "guest@volunteerhub.com";
  const GUEST_PASSWORD = "Guest123";

  function fillGuestCredentials() {
    setEmail(GUEST_EMAIL);
    setPassword(GUEST_PASSWORD);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div>
        <div className="auth-brand">
          <HeartHandshake className="auth-brand-icon" size={24} aria-hidden="true" />
          <span className="auth-brand-text">VolunteerHub</span>
        </div>

        <div className="auth-card">
          <h2>Login to VolunteerHub</h2>

          <form onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            {error && <p className="auth-error" role="alert">{error}</p>}

            <button type="button" className="seeded-hint" onClick={fillGuestCredentials}>
              Guest login — Email: <strong>{GUEST_EMAIL}</strong> | Password: <strong>{GUEST_PASSWORD}</strong>
            </button>

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}