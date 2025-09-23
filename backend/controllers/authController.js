const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Signup controller
exports.signup = async (req, res) => {
  //getting the username , email and password from the request body
  const { username, email, password } = req.body;
  try {
    // Check if user already exists by email
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "Email already registered" });

    // Hash password with salting for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ msg: "User created successfully" });
  } catch (err) {
    console.log(err);
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

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};
