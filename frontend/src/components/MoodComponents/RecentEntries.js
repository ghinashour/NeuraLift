import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import "./RecentEntries.css";

const RecentEntries = ({ entries = [], loading = false, error = null, onDelete }) => {
  const [deletingId, setDeletingId] = useState(null);

  if (loading) {
    return (
      <div className="recent-entries">
        <p>Loading your recent entries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recent-entries">
        <p className="error-text">⚠️ {error}</p>
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="recent-entries empty">
        <p>No entries yet. Your mood entries will appear here 😊</p>
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (!onDelete) return;
    setDeletingId(id);
    try {
      await onDelete(id);
    } catch (err) {
      console.error("Failed to delete entry", err);
    } finally {
      setDeletingId(null);
    }
  };

  // Dynamic mood styling + emoji
  const getMoodStyle = (mood) => {
    switch (mood.toLowerCase()) {
      case "excellent":
        return { emoji: "😄", className: "mood-badge excellent" };
      case "good":
        return { emoji: "🙂", className: "mood-badge good" };
      case "neutral":
        return { emoji: "😐", className: "mood-badge neutral" };
      case "bad":
        return { emoji: "😞", className: "mood-badge bad" };
      case "terrible":
        return { emoji: "😢", className: "mood-badge terrible" };
      default:
        return { emoji: "😊", className: "mood-badge default" };
    }
  };

  return (
    <div className="recent-entries">
      <h2 className="entries-title">Recent Entries</h2>

      {entries.map((entry) => {
        const { emoji, className } = getMoodStyle(entry.mood);
        return (
          <div key={entry._id} className="mood-entry-item">
            <div className="mood-entry-header">
              <div className="mood-info">
                <span className="mood-emoji">{emoji}</span>
                <span className={className}>{entry.mood}</span>
                <span className="mood-date">
                  {new Date(entry.date).toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => handleDelete(entry._id)}
                disabled={deletingId === entry._id}
                className="delete-button"
                title="Delete entry"
              >
                <FaTrash size={14} />
              </button>
            </div>

            {entry.note && (
              <p className="mood-note">“{entry.note}”</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RecentEntries;
