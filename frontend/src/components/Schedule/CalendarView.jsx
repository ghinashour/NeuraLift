import React from 'react';
import Button from '../UI/Button/Button';
import DayColumn from './DayColumn';
import { getWeekDates, getTimeSlots } from '../../utils/calendarHelpers';
import './CalendarView.css';
const HOUR_HEIGHT = 40; // height of each hour slot in px

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
      {/* Controls */}
      <div className="calendar-controls">
        <Button onClick={onBackToSchedule} className="schedule-back-btn">← Back</Button>
        <div className="week-controls">
          <Button onClick={onToday}>Today</Button>
          <Button onClick={onPreviousWeek}>← Week</Button>
          <Button onClick={onNextWeek}>Next →</Button>
        </div>
      </div>

      {/* Header */}
      <div className="calendar-header">
        <div className="time-column-header" />
        {weekDates.map((date, idx) => (
          <div key={idx} className="day-header">
            <div className="day-name">{date.toLocaleDateString(undefined, { weekday: 'short' })}</div>
            <div className="day-date">{date.getDate()}</div>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="calendar-body">
        <div className="time-column">
          {timeSlots.map(slot => <div key={slot} className="time-label">{slot}</div>)}
        </div>

        <div className="calendar-grid">
          {weekDates.map(date => (
            <DayColumn
              key={date.toDateString()}
              date={date}
              events={events}
              timeSlots={timeSlots}
              hourHeight={HOUR_HEIGHT}
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
