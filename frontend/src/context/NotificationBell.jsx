import React, { useContext, useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react"; // from lucide-react (already in your project)
import { SocketContext } from "../context/SocketProvider";

export default function NotificationBell() {
  const { notifications, setNotifications } = useContext(SocketContext);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef();

  // ✅ Track unread notifications
  useEffect(() => {
    if (notifications?.length) {
      const unread = notifications.filter((n) => !n.read).length;
      setUnreadCount(unread);
    }
  }, [notifications]);

  // ✅ Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Mark all as read when opening
  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-xl border border-gray-200 z-50 overflow-hidden">
          <div className="p-3 border-b text-sm font-semibold bg-gray-50">
            Notifications
          </div>
          <ul className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="p-4 text-center text-gray-500 text-sm">
                No notifications
              </li>
            ) : (
              notifications.map((notif, index) => (
                <li
                  key={index}
                  className={`px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer border-b last:border-none ${
                    notif.read ? "text-gray-600" : "font-medium text-black"
                  }`}
                >
                  {notif.message || "New notification"}
                  <div className="text-xs text-gray-400 mt-0.5">
                    {new Date(notif.timestamp || Date.now()).toLocaleString()}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
