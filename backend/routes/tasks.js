const express = require('express');
const router = express.Router();
const taskController = require('../controllers/TaskController');
const  protect  = require('../middleware/auth');

router.use(protect); // protect all task routes

router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
