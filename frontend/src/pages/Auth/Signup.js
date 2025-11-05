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

    if (!form.name.trim()) {
      setError("Full name is required");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:4000/api/auth/signup", form);
      
      Swal.fire({
        icon: 'success',
        title: 'Signup Successful',
        text: res.data.msg,
        confirmButtonColor: '#3C83F6'
      }).then(() => {
        navigate("/login"); // Redirect to login after successful signup
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text: err.response?.data?.msg || 'Signup failed',
        confirmButtonColor: '#3C83F6'
      });
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
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
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
            minLength="6"
          />
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
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
      </div>
    </div>
  );
}

export default Signup;