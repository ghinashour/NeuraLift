import { useState, useEffect } from "react";
import API from "../api/axios";

/**
 * Custom hook to fetch and provide dashboard data:
 * - Time-based greeting
 * - User streak
 * - Notifications
 */
export default function useDashboardData(userId) {
  const [greeting, setGreeting] = useState("Hello");
  const [streak, setStreak] = useState(0);
  const [notifications, setNotifications] = useState([]);

  // --- Greeting based on time of day ---
  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  };

  useEffect(() => {
    updateGreeting();
    const interval = setInterval(updateGreeting, 60 * 1000); // update every minute
    return () => clearInterval(interval);
  }, []);

  // --- Fetch streak ---
  useEffect(() => {
    if (!userId) return;

    const fetchStreak = async () => {
      try {
        const res = await API.post(`/user/${userId}/update-streak`);
        setStreak(res.data.streak);
      } catch (err) {
        console.error("Failed to fetch streak:", err);
      }
    };

    fetchStreak();
  }, [userId]);

  // --- Fetch notifications ---
  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const res = await API.get(`/notifications/${userId}`);
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, [userId]);

  // --- Browser notifications ---
  useEffect(() => {
    notifications.forEach((n) => {
      if (!n.isRead && Notification.permission === "granted") {
        new Notification(n.title, { body: n.description });
        API.patch(`/notifications/read/${n._id}`);
      }
    });
  }, [notifications]);

  return { greeting, streak, notifications };
}
