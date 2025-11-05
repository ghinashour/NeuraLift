// src/layouts/Layout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import NotificationsIcon from "../components/Notification";
import Streak from "../pages/Streak";
import useUserData from "../hooks/useUserData";
import "../styles/Sidebar.css"; // sidebar css also contains layout variables

export default function Layout() {
  const location = useLocation();
  const showSidebar = location.pathname !== "/" && location.pathname !== "/Collaborate"; // only show sidebar outside landing
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, loading, fetchUserData } = useUserData();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Listen for user updates from profile page
  useEffect(() => {
    const handleUserUpdate = () => {
      fetchUserData(); // Fetch fresh data from database
    };

    window.addEventListener("userUpdated", handleUserUpdate);
    return () => window.removeEventListener("userUpdated", handleUserUpdate);
  }, [fetchUserData]);

  return (
    <div className={`app-layout ${isSidebarOpen ? "sidebar-open" : ""}`}>
      {/* Global notification bell + streak (top-right) */}
      <div className="global-notifications">
        <div className="global-inline">
          <div className="global-streak">
            <Streak userId={user?._id} small />
          </div>
          <div className="global-bell">
            <NotificationsIcon />
          </div>
        </div>
      </div>
      {/* Hamburger menu button for mobile */}
      <div className="hamburger-menu" onClick={toggleSidebar}>
        {isSidebarOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 6L18 18" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg className="hamburger-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="line top" d="M3 6H21" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path className="line middle" d="M3 12H21" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path className="line bottom" d="M3 18H21" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {showSidebar && (
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} user={user} loading={loading} />
      )}
      {/* Overlay for mobile when sidebar is open */}
      <div className={`overlay ${isSidebarOpen ? "sidebar-open" : ""}`} onClick={toggleSidebar}></div>
      {showSidebar && <main className={`layout-main ${showSidebar ? "" : "no-sidebar"}`}>
        <Outlet />
      </main>}
    </div>
  );
}
