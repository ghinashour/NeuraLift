import React from "react";
import { FaBell, FaFire } from "react-icons/fa";
import useTimeOfDay from "../hooks/useTimeOfDay";
import useUserData from "../hooks/useUserData";
import "../styles/Dashboard.css";

export default function Greeting() {
  const { message } = useTimeOfDay();         // "Good morning" | "Good afternoon" | "Good evening"
  const { name = "User" } = useUserData();    // fetched from backend (fallback "User")

  return (
    <div className="greeting-container">
      {/* Absolutely centered block so icons on the right don't shift it */}
      <div className="greeting-center">
        <h1 className="greeting-text">
          {message}, <strong>{name}</strong> <span className="greeting-emoji">✨</span>
        </h1>
        <p className="greeting-subtext">
          Ready to make today amazing? Let’s focus on your goals.
        </p>
      </div>

      {/* Right-side icons */}
      <div className="greeting-right">
        <div className="icon-item">
          <div className="icon-box">
            <FaBell className="icon-bell" />
          </div>
          <div className="icon-subtext">Notifications</div>
        </div>
        <div className="icon-item">
          <div className="icon-box">
            <FaFire className="icon-flame" />
          </div>
          <div className="icon-subtext">Streak</div>
        </div>
      </div>
    </div>
  );
}