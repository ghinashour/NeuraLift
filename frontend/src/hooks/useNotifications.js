// hooks/useNotifications.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useSocket } from "../context/SocketProvider";

export default function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    if (!userId) return;

    // Join user's room for real-time updates if socket available
    if (socket && socket.connected) {
      try { socket.emit("join", userId); } catch (e) {}
    }

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
    if (socket) {
      socket.on("newNotification", (notif) => {
        setNotifications(prev => [notif, ...prev]);
      });
    }

    return () => {
      if (socket) socket.off("newNotification");
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
