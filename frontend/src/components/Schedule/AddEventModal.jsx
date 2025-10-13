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
    color: '#4A90E2',
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
        color: '#4A90E2',
        startDate: '',
        endDate: '',
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        <div className="modal-header">
          <h3>{event ? 'Edit Event' : 'Add Event'}</h3>
          <button onClick={onClose} className="close-btn">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <Input
            label="Event Name"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            type="textarea"
          />

          <Input
            label="Color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            type="color"
          />

          <Input
            label="Start Date & Time"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            type="datetime-local"
            required
          />

          <Input
            label="End Date & Time"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            type="datetime-local"
            required
          />

          <div className="modal-actions">
            <Button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </Button>
            <Button type="submit" className="save-btn">
              {event ? 'Update' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
