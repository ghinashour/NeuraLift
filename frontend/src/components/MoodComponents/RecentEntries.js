import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import "./RecentEntries.css";

const RecentEntries = ({ entries = [], loading = false, error = null, onDelete }) => {
  const [deletingId, setDeletingId] = useState(null);

  const deleteButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#9ca3af',
  cursor: 'pointer',
  transition: 'color 0.2s',
};


  if (loading) {
    return (
      <div className="recent-entries loading">
        <p>Loading your recent entries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recent-entries error">
        <p>⚠️ {error}</p>
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

  const getMoodStyle = (mood) => {
    switch (mood.toLowerCase()) {
      case "excellent":
      case "happy":
      case "great":
        return { emoji: "😄", className: "mood-badge excellent" };
      case "good":
        return { emoji: "🙂", className: "mood-badge good" };
      case "neutral":
        return { emoji: "😐", className: "mood-badge neutral" };
      case "bad":
        return { emoji: "😞", className: "mood-badge bad" };
      case "terrible":
      case "sad":
        return { emoji: "😢", className: "mood-badge terrible" };
      default:
        return { emoji: "😊", className: "mood-badge default" };
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Entry?",
      text: "Are you sure you want to delete this mood entry?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      setDeletingId(id);
      await onDelete(id);
      Swal.fire("Deleted!", "Your mood entry has been removed.", "success");
    } catch (err) {
      console.error("Delete failed:", err);
      Swal.fire("Error", "Failed to delete the mood entry.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="recent-entries">
      {entries.map((entry) => {
        const { emoji } = getMoodStyle(entry.mood);

        return (
          <div
            key={entry._id}
            className={`mood-entry-item ${deletingId === entry._id ? "deleting" : ""}`}
          >
            <div className="mood-entry-header">
              <div className="mood-info">
                <span className="mood-emoji">{emoji}</span>
                <span className="mood-entry-mood">{entry.mood}</span>
                <span className="mood-date">
                  {new Date(entry.date).toLocaleDateString()}{" "}
                  {new Date(entry.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              <button
                className="delete-button"
                onClick={() => handleDelete(entry._id)}
                disabled={deletingId === entry._id}
                title="Delete entry"
                style={deleteButtonStyle}
              >
                <FaTrash size={14} />
              </button>
            </div>

            {entry.note && <p className="mood-note">“{entry.note}”</p>}
          </div>
        );
      })}
    </div>
  );
};

export default RecentEntries;
