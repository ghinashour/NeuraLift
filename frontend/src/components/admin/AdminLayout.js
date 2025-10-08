import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AdminAuthContext } from "../../context/AdminAuthContext";
import AdminSidebar from "./AdminSidebar";
import "../../styles/Admin.css";

function AdminLayout() {
  const { isAuthenticated, loading } = useContext(AdminAuthContext);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;