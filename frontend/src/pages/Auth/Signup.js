import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Auth.css"; // new CSS file for auth pages

function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/auth/signup", form);
      alert("Signup successful ✅ Please login now");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
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
      </div>
    </div>
  );
}

export default Signup;
