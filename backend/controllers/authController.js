const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require('../models/Admin');
const crypto = require("crypto");
const sendVerificationEmail = require("../utils/email");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

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
      isSuspended: false
    });

    await newUser.save();
// Frontend verification link
    const verifyURL = `http://localhost:3000/verify?token=${verificationToken}`; 
    await sendVerificationEmail(newUser.email, verifyURL);
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
// Admin login
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify Email controller (frontend)
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).send("Invalid verification request.");

    const user = await User.findOne({ verificationToken: token });
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

//logout controller left to be done