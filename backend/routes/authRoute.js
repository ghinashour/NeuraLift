const express = require("express");
const router = express.Router();
const { signup, login , verifyEmail} = require("../controllers/authController");

// Routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/verify/:token", verifyEmail);
module.exports = router;
