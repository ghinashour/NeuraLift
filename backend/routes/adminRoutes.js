const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/admin');
const {loginAdmin} = require("../controllers/authController")
const { getDashboard, getUsers } = require('../controllers/adminController');

router.get('/dashboard', protect, getDashboard);
router.get('/users', protect, getUsers);
router.post("/login", loginAdmin);
//router.get('/challenges', protect, getChallenges);
//router.get('/tasks', protect, getTasks);

module.exports = router;
