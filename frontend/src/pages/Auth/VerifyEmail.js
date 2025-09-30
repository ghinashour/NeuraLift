import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    // Call backend to verify the token
    axios.get(`http://localhost:4000/api/auth/verify/${token}`)
      .then(res => {
        //responce that shows to user after verification
        setMessage("✅ Email verified successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login"); // redirect after 3 seconds
        }, 3000);
      })
      .catch(() => {
        setMessage("❌ Invalid or expired verification link.");
      });
  }, [token, navigate]);

  return <h2>{message}</h2>;
}

export default VerifyEmail;
