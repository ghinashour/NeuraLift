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

      if (res.data?.accessToken && res.data?.user) {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("user", JSON.stringify(res.data.user));
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
      </div>
    </div>
  );
}

export default Login;
