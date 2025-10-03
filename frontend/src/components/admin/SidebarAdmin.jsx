import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { pathname } = useLocation();

  const links = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/moods", label: "Mood Tracker" },
    { to: "/admin/schedules", label: "Schedules" },
    { to: "/admin/notes", label: "Notes" },
    { to: "/admin/tasks", label: "Tasks" },
    { to: "/admin/success-stories", label: "Success Stories" },
  ];

  return (
    <aside className="sidebar">
      <h2 className="logo">Neuralift Admin</h2>
      <nav>
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={pathname === link.to ? "active" : ""}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
