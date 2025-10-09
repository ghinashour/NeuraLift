import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AdminAuthContext } from "../../context/AdminAuthContext";

function AdminSidebar() {
  const { admin, logout } = useContext(AdminAuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/users", label: "Users", icon: "👥" },
    { path: "/admin/moods", label: "Moods", icon: "😊" },
    { path: "/admin/schedules", label: "Schedules", icon: "📅" },
    { path: "/admin/notes", label: "Notes", icon: "📝" },
    { path: "/admin/tasks", label: "Tasks", icon: "✅" },
    { path: "/admin/success-stories", label: "Success Stories", icon: "🌟" },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
        <div className="admin-info">
          <p>Welcome, <strong>{admin?.name}</strong></p>
          <p className="admin-email">{admin?.email}</p>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={location.pathname === item.path ? "active" : ""}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;