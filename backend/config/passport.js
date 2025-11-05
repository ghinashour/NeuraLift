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
        // ✅ Find user by Google ID OR email
        let user = await User.findOne({
          $or: [
            { googleId: profile.id },
            { email: profile.emails && profile.emails[0].value },
          ],
        });

        if (!user) {
          // ✅ Create a new user using Google profile data
          user = new User({
            googleId: profile.id,
            name: profile.displayName || "Google User",
            username:
              (profile.emails && profile.emails[0].value.split("@")[0]) ||
              `user_${Date.now()}`,
            email: profile.emails && profile.emails[0].value,
            profilePhoto:
              (profile.photos && profile.photos[0].value) ||
              "default-avatar.png",
            isVerified: true, // Google emails are verified
            authProvider: "google", // 👈 ADD THIS FIELD
          });
          await user.save();
        } else {
          // ✅ Ensure existing Google users always have correct provider field
          if (!user.authProvider || user.authProvider !== "google") {
            user.authProvider = "google";
            await user.save();
          }

          // ✅ Optionally update Google ID and photo if missing
          if (!user.googleId) user.googleId = profile.id;
          if (profile.photos?.[0]?.value && user.profilePhoto !== profile.photos[0].value) {
            user.profilePhoto = profile.photos[0].value;
            await user.save();
          }
        }

        // ✅ Pass user to next middleware
        return done(null, user);
      } catch (err) {
        console.error("Google OAuth error:", err);
        return done(err, null);
      }
    }
  )
);

// ✅ Only required if you use sessions (optional)
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
