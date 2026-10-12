import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios"
import "../../styles/Auth.css";
import Swal from 'sweetalert2';

function Signup() {
  const [form, setForm] = useState({ 
    name: "", 
    username: "", 
    email: "", 
    password: "" 
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //sign up to the site with google
  const handleGoogleLogin = () => {
    // Redirect user to backend Google auth route
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google`;
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!form.name.trim()) {
      setError("Full name is required");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, form);
      
      Swal.fire({
        icon: 'success',
        title: 'Signup Successful',
        text: res.data.msg,
        confirmButtonColor: '#2E2A44'
      }).then(() => {
        navigate("/login"); // Redirect to login after successful signup
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text: err.response?.data?.msg || 'Signup failed',
        confirmButtonColor: '#2E2A44'
      });
    } finally {
      setLoading(false);
    }
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
            Plan
            <br />
            Build
            <br />
            Rest
            <br />
            Ship
          </div>
          <div className="auth-brand">
            <span className="auth-mark">N</span>
            <span className="auth-brand-name">NeuraLift</span>
          </div>
          <p className="auth-eyebrow">Built for developers</p>
          <h3 className="auth-visual-title">
            Code calm.
            <br />
            <em>Ship more.</em>
          </h3>
          <p className="auth-visual-sub">
            Join 5,000+ developers building healthier routines — plan sprints,
            protect deep work, and grow without burnout.
          </p>
          <ul className="auth-points">
            {["Tasks, sprints & schedule in one place", "Focus timer built for coding sessions", "Health & habits that prevent burnout"].map(
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
              <span>my-sprint.js</span>
            </div>
            <pre className="auth-dev-code">
<span className="tok-c">{"// sustainable pace > crunch mode"}</span>{"\n"}<span className="tok-k">const</span> dev = <span className="tok-k">await</span> <span className="tok-f">balance</span>({"{"}{"\n"}  code: <span className="tok-s">"focused"</span>,{"\n"}  health: <span className="tok-s">"protected"</span>,{"\n"}{"}"});<span className="auth-cursor" />
            </pre>
            <div className="auth-dev-status">
              <span className="auth-pulse" />
              Tests green • take a breath
            </div>
          </div>
          <div className="auth-chip-row">
            <span className="auth-chip">{"</>"} for every dev</span>
            <span className="auth-chip">◷ sprint ready</span>
            <span className="auth-chip">✓ steady growth</span>
          </div>
        </div>

        <div className="auth-form-side">
          <p className="auth-eyebrow">Join NeuraLift — free</p>
          <h2 className="auth-title">
            Begin your <em>calmer sprint.</em>
          </h2>
          <p className="auth-lede">
            Create your free account — plan work, protect energy, and ship at a
            pace every developer can sustain.
          </p>
          {error && <p className="error" role="alert">{error}</p>}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="signup-name">Full name</label>
              <input
                id="signup-name"
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="auth-field">
              <label htmlFor="signup-username">Username</label>
              <input
                id="signup-username"
                type="text"
                name="username"
                autoComplete="username"
                placeholder="Choose a username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="auth-field">
              <label htmlFor="signup-email">Email</label>
              <input
                id="signup-email"
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
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                name="password"
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Creating Account..." : (<>Get Started Free <span className="arr" aria-hidden="true">→</span></>)}
            </button>
          </form>
          
          <div className="auth-divider">
            <span>or</span>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="btn-google"
            disabled={loading}
          >
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
            Continue with Google
          </button>

          <p className="bottom-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
          <p className="auth-footnote">
            By signing up you agree to our Terms &amp; Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;