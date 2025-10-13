import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";
import { AdminAuthContext } from "../context/AdminAuthContext";
function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AdminAuthContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:4000/api/admin/login", form, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Login response:', res.data);

      const loginSuccess = login(res.data);
      
      if (loginSuccess) {
        alert("Admin login successful ✅");
        navigate("/admin/dashboard");
      } else {
        setError("Failed to save login data. Please try again.");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Admin Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>
        <p className="bottom-text">
          Not an admin? <Link to="/login">Go to User Login</Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;