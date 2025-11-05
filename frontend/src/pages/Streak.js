import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { Flame } from "lucide-react";

import "./Streak.css";

export default function Streak({ userId }) {
  const [streak, setStreak] = useState(0);
  const [longest, setLongest] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!userId) return;

    async function updateAndFetchStreak() {
      try {
        const res = await API.post(`/user/${userId}/update-streak`);
        setStreak(res.data.streak);
        setLongest(res.data.longestStreak);
      } catch (err) {
        console.error("Failed to update streak:", err);
      }
    }

    updateAndFetchStreak();
  }, [userId]);

  const togglePopup = () => setShowPopup((prev) => !prev);

  return (
    <div className="streak-container">
      {/* Floating streak icon */}
      <button
        className="streak-button"
        onClick={togglePopup}
        aria-label="View streak details"
      >
        <span className="streak-emoji"><Flame color="white" size={27} fill="white"/></span>
        <span className="streak-number">{streak}</span>
      </button>

      {/* Popup with analytics */}
      {showPopup && (
        <div className="streak-popup">
          <div className="streak-popup-header">
            <h4>Your Streak</h4>
            <button
              className="close-popup"
              onClick={() => setShowPopup(false)}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="streak-popup-body">
            <p>🔥 Current Streak: <strong>{streak} days</strong></p>
            <p>🏆 Longest Streak: <strong>{longest} days</strong></p>
            <p>
              Keep it up! Logging in every day increases your streak and helps
              you stay consistent toward your goals.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
