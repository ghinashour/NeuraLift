// src/components/Schedule/DayColumn.jsx
import React from 'react';
import EventCard from './EventCard';

const DayColumn = ({ date, events, timeSlots, onEditEvent, onDeleteEvent }) => {
  // Filter events for this day
  const dayEvents = events.filter(event => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    return (
      start.toDateString() === date.toDateString() ||
      (start < date && end >= date)
    );
  });

  return (
    <div className="day-column">
      {timeSlots.map(slot => (
        <div key={slot} className="time-slot" />
      ))}

      {dayEvents.map(event => (
        <EventCard
          key={event._id}
          event={event}
          onEdit={onEditEvent}
          onDelete={onDeleteEvent}
        />
      ))}
    </div>
  );
};

export default DayColumn;
