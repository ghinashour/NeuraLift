// src/pages/SchedulePage.jsx
import React, { useState, useEffect } from 'react';
import CalendarView from '../../components/Schedule/CalendarView';
import EventCard from '../../components/Schedule/EventCard';
import AddEventModal from '../../components/Schedule/AddEventModal';
import Button from '../../components/UI/Button/Button';
import './SchedulePage.css';
import API from '../../api/axios';

const SchedulePage = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fetch events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get('/events/');
        setEvents(res.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  // Add event button
  const handleAddEvent = () => {
    setEditingEvent(null);
    setShowModal(true);
  };

  // Edit an event
  const handleEditEvent = (evOrId) => {
    const ev = typeof evOrId === 'string' ? events.find(e => e._id === evOrId) : evOrId;
    if (!ev) return;
    setEditingEvent(ev);
    setShowModal(true);
  };

  // Save or update event
  const handleSaveEvent = async (eventData) => {
    try {
      const payload = {
        title: eventData.title,
        description: eventData.description,
        color: eventData.color,
        startDate: eventData.startDate,
        endDate: eventData.endDate
      };

      let res;
      if (editingEvent) {
        res = await API.put(`/events/${editingEvent._id}`, payload);
        setEvents(prev => prev.map(ev => (ev._id === editingEvent._id ? res.data : ev)));
      } else {
        res = await API.post('/events', payload);
        setEvents(prev => [...prev, res.data]);
      }

      setShowModal(false);
      setEditingEvent(null);
    } catch (error) {
      console.error('Error saving event:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Error saving event. Try again.');
    }
  };

  // Delete event
  const handleDeleteEvent = async (idOrEv) => {
    const id = typeof idOrEv === 'string' ? idOrEv : idOrEv?._id;
    if (!id) return;
    try {
      await API.delete(`/events/${id}`);
      setEvents(prev => prev.filter(ev => ev._id !== id));
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
        {/* Header */}
        <div className="schedule-header">
          <h1>Schedule</h1>
          <p>Time matters. Plan your day well.</p>
        </div>

        {/* Actions */}
        <div className="schedule-actions">
          <Button className="add-btn" onClick={handleAddEvent}>Add</Button>
          <Button className="view-calendar-btn" onClick={toggleCalendarView}>
            {showCalendar ? 'View List' : 'View Calendar'}
          </Button>
        </div>

        {/* Main Content */}
        {showCalendar ? (
          <CalendarView
            currentDate={currentDate}
            events={events}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            onBackToSchedule={() => setShowCalendar(false)}
            onPreviousWeek={() => setCurrentDate(prev => new Date(prev.setDate(prev.getDate() - 7)))}
            onNextWeek={() => setCurrentDate(prev => new Date(prev.setDate(prev.getDate() + 7)))}
            onToday={() => setCurrentDate(new Date())}
          />
        ) : (
          <div className="schedule-events">
            {events.length === 0 ? (
              <div className="no-events">
                <p>No events scheduled. Click "Add" to create your first event!</p>
              </div>
            ) : (
              events.map(ev => (
                <EventCard
                  key={ev._id}
                  event={ev}
                  isScheduleView={true}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                />
              ))
            )}
          </div>
        )}

        {/* Modal */}
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
