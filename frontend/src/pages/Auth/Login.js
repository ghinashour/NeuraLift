import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../../styles/Auth.css";
import { showError } from "../../utils/alerts";
import Swal from "sweetalert2";
import googleLogo from "../../assets/google-logo.svg"; // ✅ Add this (you’ll create this asset)

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Handle redirect after Google login
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const user = query.get("user");

    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", user);

      Swal.fire({
        icon: "success",
        title: "Google login successful ✅",
        timer: 1800,
        showConfirmButton: false,
      }).then(() => {
        navigate("/dashboard");
      });
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, form);

      // Backend returns { token, user } (also accept { accessToken } for compat)
      const token = res.data?.token || res.data?.accessToken;
      if (token && res.data?.user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } else {
        throw new Error("Login failed. Please try again.");
      }

      await Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "Welcome back!",
        showConfirmButton: false,
        timer: 1800,
      });

      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "Login failed. Please try again.";
      setError(message);
      showError(message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google`;
  };

  return (
    <div className="auth-wrapper">
      <Link to="/" className="auth-back">
        <span aria-hidden="true">←</span> Back to home
      </Link>

      <div className="auth-card">
        <div className="auth-visual" aria-hidden="true">
          <span className="auth-orb orb-1" />
          <span className="auth-orb orb-2" />
          <div className="auth-handnote">
            Ship
            <br />
            Focus
            <br />
            Recover
            <br />
            Repeat
          </div>
          <div className="auth-brand">
            <span className="auth-mark">N</span>
            <span className="auth-brand-name">NeuraLift</span>
          </div>
          <p className="auth-eyebrow">Built for developers</p>
          <h3 className="auth-visual-title">
            Welcome back,
            <br />
            <em>builder.</em>
          </h3>
          <p className="auth-visual-sub">
            Log in to pick up your sprint — tasks, focus timer, health and AI
            guidance, all tuned for how developers actually work.
          </p>
          <ul className="auth-points">
            {["Plan sprints and ship on time", "Protect focus during deep work", "Recover without burnout"].map(
              (c) => (
                <li key={c}>
                  <span className="auth-check">
                    <svg viewBox="0 0 12 12" width="11" height="11">
                      <path
                        d="M2 6.4L4.8 9 10 3.4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {c}
                </li>
              )
            )}
          </ul>
          <div className="auth-dev-card">
            <div className="auth-dev-bar">
              <i />
              <i />
              <i />
              <span>focus-session.js</span>
            </div>
            <pre className="auth-dev-code">
<span className="tok-c">{"// deep work: on. notifications: off"}</span>{"\n"}<span className="tok-k">const</span> sprint = <span className="tok-f">ship</span>({"{"}{"\n"}  focus: <span className="tok-s">"protected"</span>,{"\n"}  pace: <span className="tok-s">"sustainable"</span>,{"\n"}{"}"});<span className="auth-cursor" />
            </pre>
            <div className="auth-dev-status">
              <span className="auth-pulse" />
              In the zone • 25:00 left
            </div>
          </div>
          <div className="auth-chip-row">
            <span className="auth-chip">{"</>"} dev-first</span>
            <span className="auth-chip">◷ deep-work ready</span>
            <span className="auth-chip">✓ no-burnout pace</span>
          </div>
        </div>

        <div className="auth-form-side">
          <p className="auth-eyebrow">Welcome back</p>
          <h2 className="auth-title">
            Log in to <em>continue.</em>
          </h2>
          <p className="auth-lede">
            Your sprint board, focus timer and AI pair-programmer are ready when you are.
          </p>
          {error && <p className="error" role="alert">{error}</p>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="auth-field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              Login <span className="arr" aria-hidden="true">→</span>
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          {/* ✅ Modern Google Sign-In Button */}
          <button onClick={handleGoogleLogin} className="btn-google">
            <img src={googleLogo} alt="Google" />
            Continue with Google
          </button>

          <p className="bottom-text">
            Don’t have an account? <Link to="/signup">Sign Up</Link>
          </p>
          <p className="auth-footnote">
            By continuing you agree to our Terms &amp; Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
