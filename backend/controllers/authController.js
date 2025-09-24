const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const sendVerificationEmail = require("../utils/email");


// Signup controller
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a plain random token (simpler than JWT for verification)
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: false, 
      verificationToken,
    });

    await newUser.save();

    // Verification link for frontend
    const verifyURL = `http://localhost:3000/verify/${verificationToken}`;

    console.log("Sending email to:", newUser.email);
    console.log("Verify URL:", verifyURL);

    // Send email with Ethereal
    await sendVerificationEmail(newUser.email, verifyURL);

    res.status(201).json({
      msg: "Signup successful. Check your email to verify your account.",
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


// Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    //verify if email is verified before logging in 
    
    if (!user.isVerified) {
      return res.status(403).json({ msg: "Please verify your email before logging in." });
    }
    // Create JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token,
       user: {
         id: user._id,
         username: user.username,
         email: user.email 
        } 
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Internal Server error" });
  }
};


// Verify Email controller
exports.verifyEmail = async (req, res) => {
  try {
    //try to find if the user already exists with the token
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) {
      return res.status(400).send("Invalid or expired verification link.");
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.send("Email verified successfully! You can now log in.");
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).send("Server error");
  }
};
