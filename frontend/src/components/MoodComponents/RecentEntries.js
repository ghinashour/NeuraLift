import React from "react";
import MoodEntryItem from "./MoodEntryItem";

const RecentEntries = ({ entries = [], loading = false, error = null }) => {
  // 🔹 If still loading
  if (loading) {
    return (
      <div className="recent-entries">
        <p>Loading your recent entries...</p>
      </div>
    );
  }

  // 🔹 If there's an error
  if (error) {
    return (
      <div className="recent-entries">
        <p style={{ color: "red" }}>⚠️ {error}</p>
      </div>
    );
  }

  // 🔹 If no entries found
  if (entries.length === 0 || entries.length === null) {
    return (
      <div className="recent-entries">
        <p>No entries yet. Your mood entries will appear here 😊</p>
      </div>
    );
  }

  // 🔹 Render entries
  return (
    <div className="recent-entries">
      {entries.map((entry) => (
        <MoodEntryItem key={entry._id || Math.random()} entry={entry} />
      ))}
    </div>
  );
};

export default RecentEntries;
