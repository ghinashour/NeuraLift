// src/components/Schedule/CalendarView.jsx
import React from 'react';
import Button from '../UI/Button/Button';
import DayColumn from './DayColumn';
import { getWeekDates, getTimeSlots } from '../../utils/calendarHelpers';

const CalendarView = ({ 
  currentDate, 
  events, 
  onPreviousWeek, 
  onNextWeek, 
  onToday,
  onEditEvent,
  onDeleteEvent,
  onBackToSchedule
}) => {
  const weekDates = getWeekDates(currentDate);
  const timeSlots = getTimeSlots();

  return (
    <div className="calendar-view">
      <div className="calendar-controls">
        <Button onClick={onBackToSchedule}>← Back to Schedule</Button>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button onClick={onToday}>Today</Button>
          <Button onClick={onPreviousWeek}>← Week</Button>
          <Button onClick={onNextWeek}>Next →</Button>
        </div>
      </div>

      <div className="calendar-header">
        <div className="time-column-header" />
        {weekDates.map((date, idx) => (
          <div className="day-header" key={idx}>
            <div className="day-name">{date.toLocaleDateString(undefined, { weekday: 'short' })}</div>
            <div className="day-date">{date.getDate()}</div>
          </div>
        ))}
      </div>

      <div className="calendar-body">
        <div className="time-column">
          {timeSlots.map((t, i) => <div key={i} className="time-label">{t}</div>)}
        </div>

        <div className="calendar-grid">
          {weekDates.map((date, idx) => (
            <DayColumn
              key={idx}
              date={date}
              events={events}
              timeSlots={timeSlots}
              onEditEvent={onEditEvent}
              onDeleteEvent={onDeleteEvent}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
