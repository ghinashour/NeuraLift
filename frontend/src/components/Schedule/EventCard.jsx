// src/components/Schedule/EventCard.jsx
import React from "react";
import "./EventCard.css";
import DelIcon from './Edit.png';
import EditIcon from './Delete.png';
const formatTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const EventCard = ({ event, isScheduleView = false, onEdit, onDelete, style = {} }) => {
  if (!event) return null;

  const handleEdit = (e) => {
    e.stopPropagation();
    console.log('[EventCard] edit', event.id);
    onEdit && onEdit(event);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${event.title}"?`)) return;
    console.log('[EventCard] delete', event.id);
    onDelete && onDelete(event.id);
  };

  if (isScheduleView) {
    return (
      <div
        className="schedule-event-card"
        style={{ background: event.color || "#4A90E2", ...style }}
        onClick={() => console.log('[EventCard] schedule click', event.id)}
      >
        <div className="schedule-event-content">
          <h3 className="schedule-event-title">{event.title}</h3>
          {event.description && <p className="schedule-event-description">{event.description}</p>}
          <div className="schedule-event-time">
            {formatTime(event.start)} — {formatTime(event.end)}
          </div>
        </div>

        <div className="schedule-event-actions">
          <button type="button" onClick={handleEdit} className="event-action-btn edit-btn" title="Edit">
            <img src={EditIcon} alt="Edit" />
          </button>
          <button type="button" onClick={handleDelete} className="event-action-btn delete-btn" title="Delete">
            <img src={DelIcon} alt="Delete" />
          </button>
        </div>
      </div>
    );
  }

  // calendar (small) event card - style will usually be absolute-positioned by DayColumn
  return (
    <div
      className="calendar-event-card"
      style={{ background: event.color || "#4A90E2", ...style }}
      onClick={(e) => { e.stopPropagation(); onEdit && onEdit(event); }}
      title={`${event.title} — ${formatTime(event.start)}-${formatTime(event.end)}`}
    >
      <div className="calendar-event-title">{event.title}</div>
      <div className="calendar-event-time">{formatTime(event.start)}</div>

      <div className="calendar-event-actions">
        <button type="button" onClick={(e) => { e.stopPropagation(); onEdit && onEdit(event); }} className="event-action-btn edit-btn">✏️</button>
        <button type="button" onClick={(e) => { e.stopPropagation(); onDelete && onDelete(event.id); }} className="event-action-btn delete-btn">🗑️</button>
      </div>
    </div>
  );
};

export default EventCard;
