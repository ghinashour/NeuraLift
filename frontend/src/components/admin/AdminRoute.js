import React from "react";
import { Navigate } from "react-router-dom";
import { ADMIN_EMAILS } from "../../config/admins";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  const email = localStorage.getItem("email"); // just a string

  const isAdmin = token && email && ADMIN_EMAILS.includes(email);

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;
