const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
require("dotenv").config();
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/api/auth/google/callback", // must match Google Cloud Console
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Create a new user from Google profile
          user = new User({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails && profile.emails[0].value,
            profilePhoto: profile.photos && profile.photos[0].value,
            isVerified: true, // Google emails are verified
          });
          await user.save();
        }

        return done(null, user); // Pass user to req.user
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Optional: only needed if you use session-based auth
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
