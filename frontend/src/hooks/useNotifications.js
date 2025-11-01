// hooks/useNotifications.js
import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000"); // replace with your server URL

export default function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userId) return;

    // Join user's room for real-time updates
    socket.emit("join", userId);

    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`/api/notifications/${userId}`);
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();

    // Listen for new notifications via Socket.IO
    socket.on("newNotification", (notif) => {
      setNotifications(prev => [notif, ...prev]);
    });

    return () => {
      socket.off("newNotification");
    };
  }, [userId]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/read/${id}`);
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, markAsRead, unreadCount };
}
