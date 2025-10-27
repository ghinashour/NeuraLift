import React, { useState, useEffect } from 'react';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import './AddEventModal.css';

const AddEventModal = ({ isOpen, onClose, onSave, event }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    color: '#1a73e8',
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        color: event.color,
        startDate: event.startDate.substring(0, 16),
        endDate: event.endDate.substring(0, 16),
      });
    } else {
      setFormData({
        title: '',
        description: '',
        color: '#1a73e8',
        startDate: '',
        endDate: '',
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h3>{event ? 'Edit Event' : 'Add Event'}</h3>
          <button onClick={onClose} className="close-btn" aria-label="Close Modal">
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Title */}
          <Input
            label="Event Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter event name"
            required
          />

          {/* Description */}
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Short event details"
            type="textarea"
          />

          {/* Date & Time */}
          <div className="date-time-section">
            <label className="section-label">🕒 Date & Time</label>
            <div className="date-time-fields">
              <div className="date-field">
                <label>Start</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="date-field">
                <label>End</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Color Picker */}
          <div className="color-section">
            <label className="section-label">🎨 Event Color</label>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="color-picker"
            />
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <Button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </Button>
            <Button type="submit" className="save-btn">
              {event ? 'Update Event' : 'Save Event'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
