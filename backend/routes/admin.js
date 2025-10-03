const express = require('express');
const router = express.Router();

//importing the sub routes 
const { protect } = require('../middleware/admin');
const {loginAdmin} = require("../controllers/authController")
const { getDashboard } = require('../controllers/adminController');
const mood = require("../routes/admin/moods");
const userRouter = require("./admin/users");
const scheduleRoutes = require("./admin/scheduleRoutes");
const noteRoutes = require("./admin/noteRoute");
const taskRoutes = require("./admin/taskRoutes");
const successStoryRoutes = require("./admin/successStoriesadmin");
 //login as admin
router.post("/login", loginAdmin);

//using router.use because it accepts multiple sub routers 
router.use('/dashboard', protect, getDashboard);

//getting routes from /routes/admin/{}
router.use('/users', protect, userRouter);
router.use("/moods", protect,mood );
router.use("/schedules",protect, scheduleRoutes);
router.use("/notes", protect,noteRoutes);
router.use("/tasks", protect,taskRoutes);
router.use("/success-stories", successStoryRoutes);
//router.get('/challenges', protect, getChallenges);


module.exports = router;
