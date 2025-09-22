import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Auth.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      alert("Login successful ✅");
      navigate("/"); // redirect to homepage or dashboard
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
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
