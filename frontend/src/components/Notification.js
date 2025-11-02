import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import socket from "../socket";
import { AuthContext } from "../context/AuthContext";
import { FaBell } from "react-icons/fa";

export default function NotificationsIcon() {
  const { user, token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!user) return;

    socket.emit("register", user._id);

    socket.on("newNotification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    const fetchNotifications = async () => {
      const res = await axios.get("http://localhost:4000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data.notifications);
    };

    fetchNotifications();

    return () => {
      socket.off("newNotification");
    };
  }, [user, token]);

  const markAllRead = async () => {
    await axios.post("http://localhost:4000/api/notifications/mark-read", {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <FaBell
        size={22}
        className="cursor-pointer"
        onClick={() => setShow(!show)}
      />
      {notifications.some(n => !n.read) && (
        <span className="absolute top-0 right-0 bg-red-500 rounded-full w-3 h-3" />
      )}

      {show && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-2 z-50">
          <button onClick={markAllRead} className="text-sm text-blue-600 mb-2">Mark all read</button>
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`p-2 border-b ${n.read ? "bg-gray-100" : "bg-blue-50"}`}
              >
                {n.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
