// src/pages/VerifyEmail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function VerifyEmail() {
  const [status, setStatus] = useState("Verifying...");
  const { verificationToken } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!verificationToken) {
      setStatus("Invalid verification link.");
      return;
    }

    fetch(`http://localhost:4000/api/auth/verify/${verificationToken}`)
      .then((res) => res.text())
      .then(() => {
        setStatus("Email verified successfully! Redirecting...");
        setTimeout(() => navigate("/login"), 3000);
      })
      .catch(() => setStatus("Verification failed. Try again."));
  }, [verificationToken, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{status}</h2>
    </div>
  );
}
