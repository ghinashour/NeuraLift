import React from "react";
import useDashboardData from "../hooks/useDashboardData";
import "../styles/Dashboard.css";

export default function Greeting({ name, userId }) {
  const { greeting } = useDashboardData(userId);

  return (
    <div className="greeting-container">
      <div className="greeting-center">
        <h1 className="greeting-text">
          {greeting}, <strong>{name}</strong>
          <span className="greeting-spark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 2c.7 4.8 3.2 7.3 8 8-4.8.7-7.3 3.2-8 8-.7-4.8-3.2-7.3-8-8 4.8-.7 7.3-3.2 8-8z" />
              <path d="M19 2c.3 2.2 1.5 3.4 3.7 3.7-2.2.3-3.4 1.5-3.7 3.7-.3-2.2-1.5-3.4-3.7-3.7 2.2-.3 3.4-1.5 3.7-3.7z" opacity=".65" />
            </svg>
          </span>
        </h1>
        <p className="greeting-subtext">
          Ready to make today amazing? Let’s focus on your goals.
        </p>
      </div>

      <div
        className="greeting-right"
        style={{ display: "flex", alignItems: "center", gap: "16px" }}
      >
        {/* Streak and notification bell moved to global header */}
      </div>
    </div>
  );
}
