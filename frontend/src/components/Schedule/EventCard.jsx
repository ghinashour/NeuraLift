import React from "react";
import "./EventCard.css";
import EditIcon from "./Edit.png";
import DelIcon from "./Delete.png";

const formatTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const EventCard = ({ event, isScheduleView = false, onEdit, onDelete, style = {} }) => {
  if (!event) return null;

  const eventTitle = event.name || event.title;
  const eventDesc = event.description;
  const eventStart = event.startDate || event.start;
  const eventEnd = event.endDate || event.end;
  const eventId = event._id || event.id;

  const handleEdit = (e) => { e.stopPropagation(); onEdit && onEdit(event); };
  const handleDelete = (e) => { e.stopPropagation(); onDelete && onDelete(eventId); };

  if (isScheduleView) {
    return (
      <div className="schedule-event-card" style={{ background: event.color || "#4A90E2", ...style }}>
        <div className="schedule-event-content">
          <h3 className="schedule-event-title">{eventTitle}</h3>
          {eventDesc && <p className="schedule-event-description">{eventDesc}</p>}
          <div className="schedule-event-time">
            {formatTime(eventStart)} — {formatTime(eventEnd)}
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

  return (
    <div className="calendar-event-card" style={{ background: event.color || "#4A90E2", ...style }}
      title={`${eventTitle} — ${formatTime(eventStart)}-${formatTime(eventEnd)}`}>
      <div className="calendar-event-title">{eventTitle}</div>
      <div className="calendar-event-time">{formatTime(eventStart)}</div>

      <div className="calendar-event-actions">
        <button type="button" onClick={(e)=>{e.stopPropagation(); onEdit && onEdit(event)}} className="event-action-btn edit-btn">
          <img src={EditIcon} alt="Edit" />
        </button>
        <button type="button" onClick={(e)=>{e.stopPropagation(); onDelete && onDelete(eventId)}} className="event-action-btn delete-btn">
          <img src={DelIcon} alt="Delete" />
        </button>
      </div>
    </div>
  );
};

export default EventCard;
