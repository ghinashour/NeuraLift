import React, { useEffect, useState, useContext, useRef } from "react";
import API from "../api/axios";
import { useSocket } from "../context/SocketProvider";
import { AuthContext } from "../context/AuthContext";
import { FaBell } from "react-icons/fa";
import "../styles/NotificationBell.css";
import "../styles/NotificationToast.css";

export default function NotificationsIcon() {
  const { user, token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);
  const [toast, setToast] = useState(null); // { id, message }
  const [animate, setAnimate] = useState(false);
  const bellRef = useRef(null);
  const listRef = useRef(null);
  const socket = useSocket();

  useEffect(() => {
    if (!user) return;

    // If socket is already authenticated it joins room on handshake; additionally emit register if needed
    if (socket && socket.connected) {
      socket.emit("register", user._id);
    }

    const handleIncoming = (notif) => {
      if (!notif) return;
      // show toast and insert into list
      setToast({ id: notif?._id || notif?.messageId || Date.now(), message: notif.message });
      setNotifications((prev) => {
        // Prevent duplicates
        const exists = prev.find(n => n._id === notif._id);
        if (exists) return prev;
        return [notif, ...prev];
      });
      // animate bell briefly
      setAnimate(true);
      setTimeout(() => setAnimate(false), 1000);
      // auto-hide toast
      setTimeout(() => setToast(null), 4000);
    };

    if (socket) {
      socket.on("newNotification", handleIncoming);
    }

    const fetchNotifications = async () => {
      try {
        const res = await API.get(`/notifications`);
        setNotifications(res.data.notifications || []);
      } catch (e) {
        console.error('Failed to fetch notifications', e?.response?.data || e.message);
      }
    };

    fetchNotifications();

    return () => {
      if (socket) {
        socket.off("newNotification", handleIncoming);
      }
    };
  }, [user, token, socket]);

  // Focus first notification item when dropdown opens
  useEffect(() => {
    if (show && listRef.current) {
      const first = listRef.current.querySelector('[role="menuitem"]');
      if (first) first.focus();
    }
  }, [show]);

  const markAllRead = async () => {
    try {
      await API.post(`/notifications/mark-read`, {});
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (e) {
      console.error('Failed to mark all read', e?.response?.data || e.message);
    }
  };

  const markSingleRead = async (id) => {
    try {
      const res = await API.put(`/notifications/read/${id}`);
      // Some endpoints return success flag, others return updated doc — be flexible
      if (res.data?.success || res.status === 200) {
        setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
      }
    } catch (err) {
      console.error('Failed to mark notification read', err.response?.data || err.message);
    }
  };

  const toggleShow = () => setShow((s) => !s);

  const onBellKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleShow();
    }
    if (e.key === 'Escape') {
      setShow(false);
    }
  };

  return (
    <div className="relative">
      <button
        ref={bellRef}
        className={`notification-bell notification-bell-btn ${animate ? 'pulse' : ''}`}
        aria-haspopup="true"
        aria-expanded={show}
        aria-label="Notifications"
        onClick={toggleShow}
        onKeyDown={onBellKeyDown}
      >
        <FaBell size={22} />
      </button>

      {(() => {
        const unreadCount = notifications.filter((n) => !n.read).length;
        return unreadCount > 0 ? (
          <span className="badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        ) : null;
      })()}

      {show && (
        <div
          className="notifications-dropdown absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-2 z-50"
          role="menu"
          aria-label="Notifications list"
          ref={listRef}
          tabIndex={-1}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={markAllRead} className="text-sm text-blue-600 mb-2">Mark all read</button>
          </div>
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                role="menuitem"
                tabIndex={0}
                className={`p-2 border-b notification-item ${n.read ? 'read' : 'unread'}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (!n.read) markSingleRead(n._id);
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1, paddingRight: 8 }}>{n.message}</div>
                  {!n.read && (
                    <button onClick={() => markSingleRead(n._id)} className="text-xs text-blue-600" aria-label={`Mark notification as read`}>Mark</button>
                  )}
                </div>
                <div className="meta" style={{ marginTop: 6 }}>{new Date(n.createdAt).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Toast popup */}
      {toast && (
        <div className="notification-toast" role="status">
          {toast.message}
        </div>
      )}
    </div>
  );
}
