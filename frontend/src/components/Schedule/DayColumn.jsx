// src/components/Schedule/DayColumn.jsx
import React from 'react';
import EventCard from './EventCard';

const HOUR_PX = 60; // 60px per hour (matches CSS)

const DayColumn = ({ date, events = [], timeSlots = [], onEditEvent, onDeleteEvent }) => {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const eventsForDay = events
    .map(ev => ({ ...ev, startDate: new Date(ev.start), endDate: new Date(ev.end) }))
    .filter(ev => ev.startDate >= dayStart && ev.startDate < dayEnd)
    .sort((a,b) => a.startDate - b.startDate);

  const positionForEvent = (ev) => {
    const minutesFromMidnight = ev.startDate.getHours() * 60 + ev.startDate.getMinutes();
    const durationMinutes = Math.max(15, (ev.endDate - ev.startDate) / (1000 * 60)); // minimum 15 min height
    const topPx = (minutesFromMidnight / 60) * HOUR_PX;
    const heightPx = (durationMinutes / 60) * HOUR_PX;
    return { top: topPx, height: Math.max(24, heightPx) };
  };

  return (
    <div className="day-column">
      <div className="day-content">
        <div className="events-container">
          {eventsForDay.map(ev => {
            const pos = positionForEvent(ev);
            return (
              <div
                key={ev.id}
                style={{
                  position: 'absolute',
                  left: 6,
                  right: 6,
                  top: pos.top,
                  height: pos.height,
                  zIndex: 5
                }}
              >
                <EventCard
                  event={ev}
                  isScheduleView={false}
                  onEdit={onEditEvent}
                  onDelete={onDeleteEvent}
                  style={{ height: '100%', borderRadius: 8 }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DayColumn;
