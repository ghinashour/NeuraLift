// src/pages/Admin/AdminEvents.jsx
import React, { useEffect, useState } from "react";
import { AdminAPI } from "../../api/axios"; // ✅ Use AdminAPI, not API
import "../../styles/AdminEvents.css";

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch all events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await AdminAPI.get("/events"); // baseURL already includes /api/admin
        setEvents(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // ✅ Delete event
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await AdminAPI.delete(`/events/${id}`); // no need to repeat /api/admin
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    }
  };

  if (loading) return <p>Loading events...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="admin-events">
      <h2>Event Management</h2>
      <p className="subtitle">Manage user events and schedules here</p>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <table className="events-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>User</th>
              <th>Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id}>
                <td>{event.title}</td>
                <td>{event.user?.name || "N/A"}</td>
                <td>{new Date(event.date).toLocaleDateString()}</td>
                <td>{event.time}</td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(event._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminEvents;
