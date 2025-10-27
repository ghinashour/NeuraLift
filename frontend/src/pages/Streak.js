import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { FaFire } from "react-icons/fa";
import "./Streak.css";

export default function Streak({ userId }) {
  const [streak, setStreak] = useState(0);
  const maxStreak = 30; // max streak for full circle

  useEffect(() => {
    if (!userId) return; // Skip if userId is undefined

    async function fetchStreak() {
      try {
        const res = await API.post(`/user/${userId}/update-streak`);
        setStreak(res.data.streak);
      } catch (err) {
        console.error("Failed to fetch streak:", err);
      }
    }
    fetchStreak();
  }, [userId]);

  const progress = Math.min(streak / maxStreak, 1) * 100;

  return (
    <div className="streakPage-wrapper">
      <div className="streakPage-circle">
        <svg className="streakPage-progress-ring" width="60" height="60">
          <circle
            className="streakPage-progress-ring__background"
            stroke="#eee"
            strokeWidth="6"
            fill="transparent"
            r="26"
            cx="30"
            cy="30"
          />
          <circle
            className="streakPage-progress-ring__circle"
            stroke="#ff6a00"
            strokeWidth="6"
            fill="transparent"
            r="26"
            cx="30"
            cy="30"
            strokeDasharray={2 * Math.PI * 26}
            strokeDashoffset={2 * Math.PI * 26 * (1 - progress / 100)}
          />
        </svg>
        <div className="streakPage-content">
          <FaFire className="streakPage-fire" />
          <span className="streakPage-number">{streak}</span>
        </div>
      </div>
    </div>
  );
}
