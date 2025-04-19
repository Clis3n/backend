const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('🔍 Google Profile:', profile);

        // Cek apakah user sudah ada berdasarkan googleId
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Jika belum, buat user baru dengan role default 'user'
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value || '',
          avatar: profile.photos?.[0]?.value || '',
          role: 'user', // ✅ default role
        });

        return done(null, user);
      } catch (err) {
        console.error('❌ Google Auth Error:', err);
        return done(err, null);
      }
    }
  )
);

// Serialize: simpan ID user ke session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize: ambil user lengkap dari ID session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.error('❌ Deserialize Error:', err);
    done(err, null);
  }
});

module.exports = passport;
