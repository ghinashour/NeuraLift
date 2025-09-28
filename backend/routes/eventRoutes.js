const express = require('express');
const router = express.Router();

const { createEvent, getEvents, updateEvent, deleteEvent } = require('../controllers/eventController');

// Middleware to protect routes
const { protect } = require("../middleware/authMiddleware"); // your JWT middleware

router.post("/", protect, createEvent);
router.get("/", protect, getEvents);
router.get("/:id", protect, getEventById);
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);

module.exports = router;
