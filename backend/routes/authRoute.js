const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const { signup, login , verifyEmail, getMe, resendVerification } = require("../controllers/authController");
const authMiddleware = require ("../middleware/auth");

// Routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/verify/:token", verifyEmail);
router.post('/resend-verification', resendVerification);

// Protected route
router.get("/me", authMiddleware, getMe);

//google Oauth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL || (process.env.CLIENT_ORIGIN || "http://localhost:3000").split(",")[0].trim()}/login?error=oauth_failed`, session: false }),
  (req, res) => {
    // Create JWT for your frontend
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const user = encodeURIComponent(JSON.stringify({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      profilePhoto: req.user.profilePhoto,
    }));

    // Redirect to frontend login with token and user data
    const frontendBase = (process.env.CLIENT_URL || (process.env.CLIENT_ORIGIN || "http://localhost:3000").split(",")[0] || "http://localhost:3000").trim().replace(/\/$/, "");
    res.redirect(`${frontendBase}/login?token=${token}&user=${user}`);
  }
);
module.exports = router;
