import React from "react";
import useDashboardData from "../hooks/useDashboardData";
import "../styles/Dashboard.css";

export default function Greeting({ name, userId }) {
  const { greeting } = useDashboardData(userId);

  return (
    <div className="greeting-container">
      <div className="greeting-center">
        <h1 className="greeting-text">
          {greeting}, <strong>{name}</strong>{" "}
          <span className="greeting-emoji">✨</span>
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
