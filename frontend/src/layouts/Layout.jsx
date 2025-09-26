// src/layouts/Layout.jsx
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/Sidebar.css"; // sidebar css also contains layout variables

export default function Layout() {
  const location = useLocation();
  // we expect landing ("/") to be outside Layout; extra guard:
  const showSidebar = location.pathname !== "/";
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  return (
    <div className={`app-layout ${isCollapsed ? "sidebar-collapsed" : ""}`}>
      {showSidebar && (
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} setUser={setUser}/>
      )}
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}
