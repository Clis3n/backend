const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google Profile:', profile); // Debugging profile Google

        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Pengguna baru, tetapkan peran default sebagai 'user'
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value || '',
            picture: profile.photos?.[0]?.value || '',
            role: 'user', // Menetapkan peran default sebagai 'user'
          });
          await user.save();
        } else {
          // Pengguna sudah ada, periksa peran jika perlu
          if (!user.role) {
            user.role = 'user'; // Jika tidak ada role, tetapkan sebagai 'user'
            await user.save();
          }
        }

        done(null, user); // Selesaikan login dengan user yang ditemukan
      } catch (error) {
        console.error('Google Auth Error:', error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user); // Pastikan user yang dikembalikan berisi informasi terbaru
  } catch (error) {
    console.error('Deserialize Error:', error);
    done(error, null);
  }
});

module.exports = passport;