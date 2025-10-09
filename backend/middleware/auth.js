// middleware/auth.js
const  jwt = require ("jsonwebtoken");
const User = require ("../models/User.js");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    //if the user not found case
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    //if the user is suspended from the program
    if (user.isSuspended) return res.status(403).json({ message: 'Account suspended' });
    //getting the user
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
