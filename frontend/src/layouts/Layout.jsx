
// Layout.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import { useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const location = useLocation();

  // Hide Sidebar on the landing page "/"
  const showSidebar = location.pathname !== "/";

  return (
    <div className="flex h-screen">
      {showSidebar && <Sidebar />}
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
