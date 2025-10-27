import React from 'react';
import EventCard from './EventCard';

const DayColumn = ({ date, events, timeSlots, hourHeight, onEditEvent, onDeleteEvent }) => {
  const dayEvents = events.filter(event => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    return (
      start.toDateString() === date.toDateString() ||
      (start < date && end >= date)
    );
  });

  const getEventStyle = (event) => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    const top = start.getHours() * hourHeight;
    const height = ((end - start) / 1000 / 60 / 60) * hourHeight;

    return {
      top: `${top}px`,
      height: `${height}px`,
      position: 'absolute',
      left: '4px',
      right: '4px',
    };
  };

  return (
    <div className="day-column" style={{ position: 'relative' }}>
      {timeSlots.map(slot => <div key={slot} className="time-slot" style={{ height: `${hourHeight}px` }} />)}

      {dayEvents.map(event => (
        <EventCard
          key={event._id || event.id}
          event={event}
          onEdit={onEditEvent}
          onDelete={onDeleteEvent}
          style={getEventStyle(event)}
        />
      ))}
    </div>
  );
};

export default DayColumn;
