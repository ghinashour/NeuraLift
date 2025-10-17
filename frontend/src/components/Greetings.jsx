import React, { useState } from "react";
import useDashboardData from "../hooks/useDashboardData";
import Streak from "../pages/Streak";
import { FaBell } from "react-icons/fa";
import "../styles/Dashboard.css";

export default function Greeting({ name, userId }) {
  const { greeting, streak, notifications } = useDashboardData(userId);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="greeting-container">
      <div className="greeting-center">
        <h1 className="greeting-text">
          {greeting}, <strong>{name}</strong> <span className="greeting-emoji">✨</span>
        </h1>
        <p className="greeting-subtext">
          Ready to make today amazing? Let’s focus on your goals.
        </p>
      </div>

      <div className="greeting-right" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <span><Streak/></span>

        {/* Notifications */}
        <div style={{ position: "relative", cursor: "pointer" }}>
          <FaBell size={24} onClick={() => setShowNotifications(!showNotifications)} />
          {notifications.filter(n => !n.isRead).length > 0 && (
            <span style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              background: "red",
              color: "white",
              borderRadius: "50%",
              width: "18px",
              height: "18px",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {notifications.filter(n => !n.isRead).length}
            </span>
          )}

          {showNotifications && (
            <div style={{
              position: "absolute",
              top: "30px",
              right: "0",
              width: "320px",
              maxHeight: "400px",
              overflowY: "auto",
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              zIndex: 1000,
              padding: "10px"
            }}>
              <h4>Notifications</h4>
              {notifications.length === 0 && <p>No notifications</p>}
              <ul style={{ listStyle: "none", padding: 0 }}>
                {notifications.map(n => (
                  <li key={n._id} style={{
                    background: n.isRead ? "#f9f9f9" : "#ffe6b3",
                    padding: "8px",
                    marginBottom: "6px",
                    borderRadius: "6px"
                  }}>
                    <strong>{n.title}</strong> <br />
                    <small>{n.description}</small>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
