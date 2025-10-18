import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function VerifyEmail() {
  const [status, setStatus] = useState("Verifying...");
  const navigate = useNavigate();
  const { verificationToken } = useParams();

  useEffect(() => {
    if (!verificationToken) {
      setStatus("Invalid verification link.");
      return;
    }

    fetch(`http://localhost:4000/api/auth/verify/${verificationToken}`)
      .then((res) => res.text())
      .then((msg) => {
        setStatus(msg);
        setTimeout(() => navigate("/login"), 3000);
      })
      .catch(() => setStatus("Verification failed. Try again."));
  }, [navigate, verificationToken]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{status}</h2>
    </div>
  );
}
