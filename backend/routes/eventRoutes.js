const express = require('express');
const router = express.Router();

const { createEvent, getEventById, updateEvent, deleteEvent, getEvents } = require('../controllers/eventController');

// Middleware to protect routes as a function 
const  protect = require("../middleware/auth");

router.post("/", protect, createEvent);
router.get("/",protect,getEvents)
router.get("/:id", protect, getEventById);
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);

module.exports = router;
