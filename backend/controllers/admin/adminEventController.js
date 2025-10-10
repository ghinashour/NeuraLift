const Event = require('../../models/Event');
const User = require('../../models/User');

// Get all events for all users
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('user', 'name email')
      .sort({ startDate: 1 });

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching all events:', error);
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
};

// Get events for a specific user
exports.getUserEvents = async (req, res) => {
  try {
    const { userId } = req.params;
    const events = await Event.find({ user: userId }).sort({ startDate: 1 });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({ message: 'Failed to fetch user events', error: error.message });
  }
};

// Create new event for any user
exports.createEventForUser = async (req, res) => {
  try {
    const { userId, title, description, color, startDate, endDate } = req.body;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newEvent = await Event.create({
      user: userId,
      title,
      description,
      color: color || '#3788d8',
      startDate,
      endDate,
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event for user:', error);
    res.status(500).json({ message: 'Failed to create event', error: error.message });
  }
};

// Update event (any user)
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, color, startDate, endDate } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.color = color || event.color;
    event.startDate = startDate || event.startDate;
    event.endDate = endDate || event.endDate;

    const updatedEvent = await event.save();
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Failed to update event', error: error.message });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.deleteOne();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Failed to delete event', error: error.message });
  }
};
