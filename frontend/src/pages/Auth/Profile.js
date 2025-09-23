import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/protected"); // protected route
        setUserData(res.data);
      } catch (err) {
        console.log(err);
        navigate("/login"); // redirect if token invalid
      }
    };
    fetchProfile();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {userData ? (
        <>
          <h2>Welcome, {userData.message.split(" ")[1]}</h2>
          <p>{JSON.stringify(userData)}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Profile;
