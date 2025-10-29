import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../../styles/Auth.css";
import { showError } from "../../utils/alerts";
import Swal from "sweetalert2";

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
      // Store token + user info
      localStorage.setItem("token", token);
      localStorage.setItem("user", user); // backend sends it already stringified

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

  // ✅ Update form values
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle login with email/password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", form);

      // ✅ Store JWT token and user info
      if (res.data?.token && res.data?.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      // ✅ Show success message before redirecting
      await Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "Welcome back!",
        showConfirmButton: false,
        timer: 1800,
      });

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response || err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        "Login failed. Please try again.";
      setError(message);
      showError(message);
    }
  };

  // ✅ Google login redirect
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/api/auth/google";
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
          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>

        <p className="bottom-text">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
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
            marginTop: "10px",
          }}
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
