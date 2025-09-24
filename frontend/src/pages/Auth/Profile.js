import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/Profile.css";

function Profile() {
  const [user, setUser] = useState({});
  const [photo, setPhoto] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Fetch user profile
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setForm({ name: res.data.name, email: res.data.email });
      })
      .catch((err) => console.error(err));
  }, [token]);

  // Update profile info
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", form.name);
    data.append("email", form.email);
    if (photo) data.append("photo", photo);

    try {
      const res = await axios.put("http://localhost:4000/api/profile", data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data)); // ✅ keep sidebar in sync
      setMessage("Profile updated ✅");
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    }
  };

  // Change password
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:4000/api/profile/password", passwords, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Password updated ✅");
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Password update failed");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <h2>Profile</h2>

        {/* ✅ Rounded profile photo at top */}
        {user.profilePhoto && (
          <img
            src={`http://localhost:4000/uploads/${user.profilePhoto}`}
            alt="profile"
            className="profile-avatar"
          />
        )}

        {message && <p>{message}</p>}

        {/* Update Profile Form */}
        <form onSubmit={handleProfileUpdate}>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
          />
          <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />
          <button type="submit" className="update-btn">
            Update Profile
          </button>
        </form>

        {/* Change Password Form */}
        <form onSubmit={handlePasswordChange}>
          <input
            type="password"
            placeholder="Current Password"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
          />
          <input
            type="password"
            placeholder="New Password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
          />
          <button type="submit" className="password-btn">
            Change Password
          </button>
        </form>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
