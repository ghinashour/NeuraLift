const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/admin');
const {loginAdmin} = require("../controllers/authController")
const { getDashboard } = require('../controllers/adminController');
const mood = require("../routes/admin/moods");
const userRouter = require("./admin/users");
const scheduleRoutes = require("./admin/scheduleRoutes");
 //login as admin
router.post("/login", loginAdmin);

//using router.use because it accepts multiple sub routers 
router.use('/dashboard', protect, getDashboard);
//getting routes from /routes/admin/{}
router.use('/users', protect, userRouter);
router.use("/moods", protect,mood );
router.use("/api/admin/schedules", scheduleRoutes);
//router.get('/challenges', protect, getChallenges);
//router.get('/tasks', protect, getTasks);

module.exports = router;
