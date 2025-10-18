// src/layouts/Layout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import useUserData from "../hooks/useUserData";
import "../styles/Sidebar.css"; // sidebar css also contains layout variables

export default function Layout() {
  const location = useLocation();
  const showSidebar = location.pathname !== "/" || location.pathname !== "/Collaborate"; // only show sidebar outside landing
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, loading, fetchUserData } = useUserData();

  // Listen for user updates from profile page
  useEffect(() => {
    const handleUserUpdate = () => {
      fetchUserData(); // Fetch fresh data from database
    };

    window.addEventListener("userUpdated", handleUserUpdate);
    return () => window.removeEventListener("userUpdated", handleUserUpdate);
  }, [fetchUserData]);

  return (
    <div className={`app-layout ${isCollapsed ? "sidebar-collapsed" : ""}`}>
      {showSidebar && (
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} user={user} loading={loading} />
      )}
      <main className={`layout-main ${showSidebar ? "" : "no-sidebar"}`}>
        <Outlet />
      </main>
    </div>
  );
}
