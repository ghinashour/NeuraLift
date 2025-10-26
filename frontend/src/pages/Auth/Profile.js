import React, { useState, useEffect } from "react";
import axios from "axios";
import useUserData from "../../hooks/useUserData";
import avatarPlaceholder from "../../assets/avatar.png";
import "../../styles/Profile.css";

function Profile() {
  const { user, loading, fetchUserData } = useUserData();
  const [photo, setPhoto] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", username: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setForm({ 
        name: user.name || "", // Use name field
        email: user.email || "",
        username: user.username || "" // Keep username if needed
      });
    }
  }, [user]);

  // Auto-update profile when photo is selected
  useEffect(() => {
    if (photo) {
      handlePhotoUpdate();
    }
  }, [photo]);

  // Handle photo update separately
  const handlePhotoUpdate = async () => {
    if (!photo) return;

    const data = new FormData();
    data.append("name", form.name);
    data.append("email", form.email);
    data.append("username", form.username);
    data.append("photo", photo);

    try {
      await axios.put("http://localhost:4000/api/profile", data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      // Refresh user data from database
      await fetchUserData();
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent("userUpdated"));
      setMessage("Profile photo updated ✅");
      setPhoto(null); // Reset photo state
    } catch (err) {
      setMessage(err.response?.data?.message || "Photo update failed");
    }
  };

  // Update profile info
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", form.name);
    data.append("email", form.email);
    data.append("username", form.username);

    try {
      const res = await axios.put("http://localhost:4000/api/profile", data, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      // Refresh user data from database
      await fetchUserData();
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent("userUpdated"));
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

  if (loading) {
    return (
      <div className="profile-wrapper">
        <div className="profile-card">
          <div className="loading-message">
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-wrapper">
        <div className="profile-card">
          <div className="error-message">
            <p>Please log in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <h2>Profile</h2>

        {/* ✅ Interactive profile photo with hover overlay */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="profile-photo-container">
            <img
              src={
                user.profilePhoto
                  ? `http://localhost:4000/uploads/${user.profilePhoto}`
                  : avatarPlaceholder
              }
              alt="profile"
              className="profile-avatar"
              onError={(e) => {
                e.target.src = avatarPlaceholder;
              }}
            />
            <div className="profile-photo-overlay">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 384 384" className="edit-icon">
                <path fill="#ffffff" d="M0 304L236 68l80 80L80 384H0v-80zM378 86l-39 39l-80-80l39-39q6-6 15-6t15 6l50 50q6 6 6 15t-6 15z" />
              </svg>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
              className="profile-photo-input"
              id="profile-photo-input"
            />
            <label htmlFor="profile-photo-input" className="profile-photo-label"></label>
          </div>
        </div>

        {/* User info display */}
        <div className="user-info-display">
          <h3>{user.name || "User"}</h3>
          <p>@{user.username}</p>
          <p>{user.email}</p>
        </div>

        {message && <p className="message">{message}</p>}

        {/* Update Profile Form */}
        <form onSubmit={handleProfileUpdate} className="profile-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your full name"
            />
          </div>
          
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              placeholder="Username"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email address"
            />
          </div>
          
          <button type="submit" className="update-btn">
            Update Profile
          </button>
        </form>

        {/* Change Password Form */}
        <form onSubmit={handlePasswordChange} className="password-form">
          <h3>Change Password</h3>
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
            />
          </div>
          
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            />
          </div>
          
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