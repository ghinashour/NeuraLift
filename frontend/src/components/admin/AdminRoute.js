import React from "react";
import { Navigate } from "react-router-dom";
import { ADMIN_EMAILS } from "../../config/admins";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email"); // stored at login

  const isAdmin = token && ADMIN_EMAILS.includes(email);

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
