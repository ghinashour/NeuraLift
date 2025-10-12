const express = require('express');
const router = express.Router();

const {
  getAllEvents,
  getUserEvents,
  createEventForUser,
  updateEvent,
  deleteEvent
} = require('../../controllers/admin/adminEventController');

const { protect } = require('../../middleware/admin');


// GET all events for all users
router.use('/', protect,getAllEvents);

// GET events for a specific user
router.use('/user/:userId', protect,getUserEvents);

// CREATE new event for any user
router.use('/', protect,createEventForUser);

// UPDATE event
router.use('/:id', protect,updateEvent);

// DELETE event
router.delete('/:id', deleteEvent);

module.exports = router;
