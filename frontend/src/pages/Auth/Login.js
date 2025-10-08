import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Auth.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Update form values
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", form);

      // Store JWT token
      localStorage.setItem("token", res.data.token);

      // Optional: store user info
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent("userUpdated"));

      // Notify user
      alert("Login successful ✅");

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      // Show backend error message if exists
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="btn-primary">Login</button>
        </form>
        <p className="bottom-text">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
