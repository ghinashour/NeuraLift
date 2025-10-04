const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const { signup, login , verifyEmail, getMe} = require("../controllers/authController");
const authMiddleware = require ("../middleware/auth");

// Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/verify", verifyEmail);

// Protected route
router.get("/me", authMiddleware, getMe);

//google Oauth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Create JWT for your frontend
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Redirect to frontend with token
    res.redirect(`http://localhost:3000?token=${token}`);
  }
);
module.exports = router;
