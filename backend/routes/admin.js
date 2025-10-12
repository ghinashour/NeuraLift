const express = require('express');
const router = express.Router();

//importing the sub routes 
const { protect } = require('../middleware/admin');
const {loginAdmin} = require("../controllers/authController")
const { getDashboard } = require('../controllers/adminController');
// Import sub-routes
const moodRoutes = require("./admin/moods");
const userRouter = require("./admin/users");
const scheduleRoutes = require("./admin/scheduleRoutes");
const noteRoutes = require("./admin/noteRoute");
const taskRoutes = require("./admin/taskRoutes");
const successStoryRoutes = require("./admin/successStoriesadmin");
const analyticsRoutes = require("./admin/analytics");
const adminEventRoutes = require('./admin/adminEventRoutes');

 //login as admin
router.post("/login", loginAdmin);

//using router.use because it accepts multiple sub routers 
router.get('/dashboard', protect, getDashboard);

// Analytics routes
router.use('/analytics', protect, analyticsRoutes);


//getting routes from /routes/admin/{}
router.use('/users', protect, userRouter);
router.use("/moods", protect, moodRoutes );
router.use("/schedules",protect, scheduleRoutes);
router.use("/notes", protect,noteRoutes);
router.use("/tasks", protect,taskRoutes);
router.use("/stories", successStoryRoutes);
router.use('/events', protect, adminEventRoutes);

module.exports = router;
