import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import useUserData from "../../hooks/useUserData";
import avatarPlaceholder from "../../assets/avatar.png";
import "../../styles/Profile.css";

function Profile() {
  const { user, loading, fetchUserData } = useUserData();
  const [photo, setPhoto] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", username: "" });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        username: user.username || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (photo) handlePhotoUpdate();
  }, [photo]);

  const showAlert = (icon, title, text) => {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: "#3085d6",
    });
  };

  const handlePhotoUpdate = async () => {
    if (!photo) return;
    const data = new FormData();
    data.append("name", form.name);
    data.append("email", form.email);
    data.append("username", form.username);
    data.append("photo", photo);

    try {
      await axios.put("http://localhost:4000/api/profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchUserData();
      window.location.reload();
      setPhoto(null);
    } catch (err) {
      showAlert("error", "Photo Update Failed", err.response?.data?.message || "Something went wrong.");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", form.name);
    data.append("email", form.email);
    data.append("username", form.username);

    try {
      await axios.put("http://localhost:4000/api/profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchUserData();
      showAlert("success", "Profile Updated ✅", "Your profile has been saved.");
    } catch (err) {
      showAlert("error", "Update Failed", err.response?.data?.message || "Unable to update profile.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:4000/api/profile/password", passwords, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showAlert("success", "Password Updated ✅", "Your password has been changed.");
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (err) {
      showAlert("error", "Password Update Failed", err.response?.data?.message || "Please check your current password.");
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, log out",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    });
  };

  if (loading)
    return (
      <div className="profile-wrapper">
        <div className="profile-card">
          <p>Loading profile...</p>
        </div>
      </div>
    );

  if (!user)
    return (
      <div className="profile-wrapper">
        <div className="profile-card">
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <h2>Profile</h2>

        {/* ✅ Profile Photo */}
        <div style={{ display: "flex", justifyContent: "center" }}>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 384 384"
                className="edit-icon"
              >
                <path
                  fill="#ffffff"
                  d="M0 304L236 68l80 80L80 384H0v-80zM378 86l-39 39l-80-80l39-39q6-6 15-6t15 6l50 50q6 6 6 15t-6 15z"
                />
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

        {/* ✅ User Info */}
        <div className="user-info-display">
          <h3>{user.name || "User"}</h3>
          <p>@{user.username}</p>
          <p>{user.email}</p>
        </div>

        {/* ✅ Profile Form */}
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

        {/* ✅ Show Change Password only if NOT Google User */}
        {user.authProvider !== "google" && (
          <form onSubmit={handlePasswordChange} className="password-form">
            <h3>Change Password</h3>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                value={passwords.currentPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, currentPassword: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
              />
            </div>

            <button type="submit" className="password-btn">
              Change Password
            </button>
          </form>
        )}

        {/* ✅ Logout */}
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
