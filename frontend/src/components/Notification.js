// components/Notifications.jsx
import React, { useEffect, useState } from "react";
import API from "../api/axios";

export default function Notifications({ userId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userId) return; // skip if no userId

    async function fetchNotifications() {
      try {
        const res = await API.get(`/notifications/${userId}`);
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    }

    fetchNotifications();

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, [userId]);

  useEffect(() => {
    if (!notifications.length) return;

    notifications.forEach(async (n) => {
      if (!n.isRead) {
        try {
          if (Notification.permission === "granted") {
            new Notification(n.title, { body: n.description });
          }
          await API.patch(`/notifications/read/${n._id}`);
        } catch (err) {
          console.error("Failed to mark notification as read:", err);
        }
      }
    });
  }, [notifications]);

  return (
    <div style={{ padding: "10px" }}>
      <h3>Notifications</h3>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notifications.map((n) => (
            <li
              key={n._id}
              style={{
                background: n.isRead ? "#f0f0f0" : "#ffe6b3",
                marginBottom: "5px",
                padding: "5px",
                borderRadius: "5px",
              }}
            >
              <strong>{n.title}</strong> <br />
              <small>{n.description}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
