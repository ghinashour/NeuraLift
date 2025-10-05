const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
const crypto = require("crypto");
const sendVerificationEmail = require("../utils/email");
const sendResetPasswordEmail = require("../utils/resetEmail"); // create this util

// Generate Access Token
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "3d" }); // short-lived
};

// Generate Refresh Token
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

// Signup controller
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 3600000; // 1 hour expiry

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpiry: tokenExpiry,
      isSuspended: false,
    });

    await newUser.save();

    const verifyURL = `${process.env.CLIENT_URL}/verify?token=${verificationToken}`;
    await sendVerificationEmail(newUser.email, verifyURL);

    res.status(201).json({ msg: "Signup successful, please check your email to verify your account." });
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

    if (!user.isVerified) {
      return res.status(403).json({ msg: "Please verify your email before logging in." });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const accessToken = generateAccessToken({ id: user._id });
    const refreshToken = generateRefreshToken({ id: user._id });

    // Send refresh token in HttpOnly cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Internal Server error" });
  }
};

// Refresh Token Controller
exports.refreshToken = (req, res) => {
  const refreshToken = req.cookies.jwt;
  if (!refreshToken) return res.status(401).json({ msg: "No refresh token" });

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ msg: "Invalid refresh token" });
    const newAccessToken = generateAccessToken({ id: user.id });
    res.json({ accessToken: newAccessToken });
  });
};


// Admin login
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email
      },
      token: generateAccessToken({ id: admin._id, role: "admin" })
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Invalid verification request." });
    }

    // Find user with matching token that hasn't expired
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification link." });
    }

    // Update user directly (avoids re-validating required fields like password)
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          isVerified: true,
          verificationToken: null,
          verificationTokenExpiry: null
        }
      }
    );

    res.json({ message: "Email verified successfully! You can now log in." });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetURL = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    await sendResetPasswordEmail(user.email, resetURL);

    res.json({ msg: "Password reset email sent" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie("jwt", { httpOnly: true, sameSite: "Strict", secure: process.env.NODE_ENV === "production" });
  res.json({ msg: "Logged out successfully" });
};

// Get Me
exports.getMe = async (req, res) => {
  try {
    res.json({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      profilePhoto: req.user.profilePhoto,
      isVerified: req.user.isVerified,
      lastLogin: req.user.lastLogin,
    });
  } catch (err) {
    console.error("GetMe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
