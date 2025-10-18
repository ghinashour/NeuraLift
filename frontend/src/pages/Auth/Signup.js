import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../api/auth";
import "../../styles/Auth.css";
function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //sign up to the site with google
  const handleGoogleLogin = () => {
    // Redirect user to backend Google auth route
    window.location.href = "http://localhost:4000/api/auth/google";
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const res = await signup(form);
      // backend might return { msg } or { success }
      alert(res.data?.msg || "Account created. Check your email to verify.");
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Create Account</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-primary">Sign Up</button>
        </form>
        <p className="bottom-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
            <button
      onClick={handleGoogleLogin}
      style={{
        padding: "10px 20px",
        backgroundColor: "#4285F4",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Continue with Google
    </button>
      </div>
    </div>
  );
}

export default Signup;
