// src/pages/SchedulePage.jsx
import React, { useState, useEffect } from 'react';
import CalendarView from '../../components/Schedule/CalendarView';
import EventCard from '../../components/Schedule/EventCard';
import AddEventModal from '../../components/Schedule/AddEventModal';
import Button from '../../components/UI/Button/Button';
import './SchedulePage.css';
import axios from 'axios';

const SchedulePage = () => {
const [events, setEvents] = useState([]);
const [showModal, setShowModal] = useState(false);
const [editingEvent, setEditingEvent] = useState(null);
const [showCalendar, setShowCalendar] = useState(false);

// Example: get token from localStorage (adjust if stored differently)
const token = localStorage.getItem('token');

// Fetch events on mount
useEffect(() => {
const fetchEvents = async () => {
try {
const res = await axios.get('http://localhost:4000/api/events', {
headers: { Authorization: `Bearer ${token}` },
});
setEvents(res.data);
} catch (error) {
console.error('Error fetching events:', error);
}
};
fetchEvents();
}, [token]);

const handleAddEvent = () => {
setEditingEvent(null);
setShowModal(true);
};

const handleEditEvent = (evOrId) => {
const ev = typeof evOrId === 'string' ? events.find(e => e._id === evOrId) : evOrId;
if (!ev) return;
setEditingEvent(ev);
setShowModal(true);
};

const handleSaveEvent = async (eventData) => {
try {
if (editingEvent) {
const res = await axios.put(
`http://localhost:4000/api/events/${editingEvent._id}`,
eventData,
{ headers: { Authorization: `Bearer ${token}` } }
);
setEvents(events.map(ev => (ev._id === editingEvent._id ? res.data : ev)));
} else {
const res = await axios.post(
'http://localhost:4000/api/events',
eventData,
{ headers: { Authorization: `Bearer ${token}` } }
);
setEvents([...events, res.data]);
}
setShowModal(false);
setEditingEvent(null);
} catch (error) {
console.error('Error saving event:', error);
alert('Error saving event. Try again.');
}
};

const handleDeleteEvent = async (idOrEv) => {
const id = typeof idOrEv === 'string' ? idOrEv : idOrEv?._id;
if (!id) return;
try {
await axios.delete(`http://localhost:4000/api/events/${id}`, {
headers: { Authorization: `Bearer ${token}` },
});
setEvents(events.filter(ev => ev._id !== id));
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

return ( <div className="schedule-container"> <div className="schedule-view"> <div className="schedule-header"> <h1>Schedule</h1> <p>Time matters. Plan your day well.</p> </div>
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
              key={ev._id}
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
        events={events}
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
