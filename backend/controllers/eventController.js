const Event = require('../models/Event');

// Create a new event
exports.createEvent = async (req, res) => {
    try {
        const { name, description, color, startDate, endDate } = req.body;
        //checking if all fields are present
        if(!name || !description || !startDate || !endDate){
            return res.status(400).json({message:"Please fill all required fields"});
        }
        //creating the new event
        const newEvent = await Event.create({
            user: req.user._id,
            name,
            description,
            color,
            startDate,
            endDate
        });
        res.status(201).json(newEvent);
    }catch(err){
        console.error("error in the event controller",err);
        res.status(500).json({message:"Server Error"});
    }
};


//get a specific user's events by the id 
const getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, user: req.user.id });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an existing event
const updateEvent = async (req, res) => {
    try{
        //get the event to be updated
        const event = await Event.findOne({ _id: req.params.id, user: req.user.id });
        //if not found
        if (!event) return res.status(404).json({ message: "Event not found" });
        //update the event
        const updated= await Event.findByIdAndUpdate(event._id, req.body, { new: true , runValidators: true});
        res.json(updated);
    }catch(err){
        console.error("error in the updateevent controller",err);
        res.status(500).json({message:"Server Error"});
    }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, user: req.user.id });
    if (!event) return res.status(404).json({ message: "Event not found" });

    await event.deleteOne();
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    createEvent,
    getEventById,
    updateEvent,
    deleteEvent
};