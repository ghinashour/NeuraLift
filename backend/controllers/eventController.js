const Event = require('../models/Event');


const createEvent = async (req, res) => {
  try {
    console.log("Body received:", req.body);

    // Make sure req.user exists (set by auth middleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const event = await Event.create({
      user: req.user.id,          // <-- required
      title: req.body.title,
      description: req.body.description,
      color: req.body.color || "#3788d8",
      startDate: req.body.startDate,
      endDate: req.body.endDate
    });

    res.status(201).json(event);
  } catch (err) {
    console.error("Error in createEvent:", err);
    res.status(400).json(err);
  }
};


// Get all events for the user
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ user: req.user._id }).sort({ startDate: 1 });

    const formatted = events.map(ev => ({
      _id: ev._id,
      title: ev.name,
      description: ev.description,
      color: ev.color,
      startDate: ev.startDate,
      endDate: ev.endDate
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Error in getEvents:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get event by ID
const getEventById = async (req, res) => {
  try {
    const ev = await Event.findOne({ _id: req.params.id, user: req.user._id });
    if (!ev) return res.status(404).json({ message: "Event not found" });

    res.json({
      _id: ev._id,
      title: ev.name,
      description: ev.description,
      color: ev.color,
      startDate: ev.startDate,
      endDate: ev.endDate
    });
  } catch (err) {
    console.error("Error in getEventById:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update an existing event
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, user: req.user._id });
    if (!event) return res.status(404).json({ message: "Event not found" });

    const { title, description, color, startDate, endDate } = req.body;

    event.name = title || event.name;
    event.description = description || event.description;
    event.color = color || event.color;
    event.startDate = startDate || event.startDate;
    event.endDate = endDate || event.endDate;

    const updated = await event.save();

    res.json({
      _id: updated._id,
      title: updated.name,
      description: updated.description,
      color: updated.color,
      startDate: updated.startDate,
      endDate: updated.endDate
    });
  } catch (err) {
    console.error("Error in updateEvent:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, user: req.user._id });
    if (!event) return res.status(404).json({ message: "Event not found" });

    await event.deleteOne();
    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error("Error in deleteEvent:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
};
