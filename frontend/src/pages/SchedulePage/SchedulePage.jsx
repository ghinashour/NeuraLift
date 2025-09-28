// src/pages/SchedulePage.jsx
import React, { useState } from 'react';
import CalendarView from '../../components/Schedule/CalendarView';
import EventCard from '../../components/Schedule/EventCard';
import AddEventModal from '../../components/Schedule/AddEventModal';
import Button from '../../components/UI/Button/Button';
import { useCalendar } from '../../hooks/useCalendar';
import { useEvents } from '../../hooks/useEvents';
import './SchedulePage.css';

const SchedulePage = () => {
  const { currentDate, goToToday, goToPreviousWeek, goToNextWeek } = useCalendar();
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowModal(true);
  };

  const handleEditEvent = (evOrId) => {
    // tolerant: can be id or full event
    const ev = typeof evOrId === 'string' ? events.find(e => e.id === evOrId) : evOrId;
    if (!ev) {
      console.warn('Edit event not found:', evOrId);
      return;
    }
    setEditingEvent(ev);
    setShowModal(true);
  };

  const handleSaveEvent = (eventData) => {
    try {
      if (editingEvent) {
        updateEvent(editingEvent.id, eventData);
      } else {
        addEvent(eventData);
      }
      setShowModal(false);
      setEditingEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event. Try again.');
    }
  };

  const handleDeleteEvent = (idOrEv) => {
    const id = typeof idOrEv === 'string' ? idOrEv : idOrEv?.id;
    if (!id) {
      console.warn('Delete called without id', idOrEv);
      return;
    }
    try {
      deleteEvent(id);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event. Try again.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEvent(null);
  };

  const toggleCalendarView = () => setShowCalendar(prev => !prev);

  return (
    <div className="schedule-container">
      <div className="schedule-view">
        <div className="schedule-header">
          <h1>Schedule</h1>
          <p>Time matters. Plan your day well.</p>
        </div>

        <div className="schedule-actions">
          <Button className="add-btn" onClick={handleAddEvent}>Add</Button>
          <Button className="view-calendar-btn" onClick={toggleCalendarView}>
            {showCalendar ? 'View List' : 'View Calendar'}
          </Button>
        </div>

        {!showCalendar ? (
          <div className="schedule-events">
            {events.length === 0 ? (
              <div className="no-events">
                <p>No events scheduled. Click "Add" to create your first event!</p>
              </div>
            ) : (
              events.map(ev => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  isScheduleView={true}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                />
              ))
            )}
          </div>
        ) : (
          <CalendarView
            currentDate={currentDate}
            events={events}
            onPreviousWeek={goToPreviousWeek}
            onNextWeek={goToNextWeek}
            onToday={goToToday}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            onBackToSchedule={() => setShowCalendar(false)}
          />
        )}

        {showModal && (
          <AddEventModal
            isOpen={showModal}
            onClose={handleCloseModal}
            onSave={handleSaveEvent}
            event={editingEvent}
          />
        )}
      </div>
    </div>
  );
};

export default SchedulePage;
