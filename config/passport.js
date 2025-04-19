const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],  // Tentukan scope yang sesuai
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google Profile:', profile);

        // Cari apakah pengguna sudah ada berdasarkan googleId
        let user = await User.findOne({ googleId: profile.id });

        // Jika pengguna belum ada, buat pengguna baru
        if (!user) {
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value || '',  // Ambil email pertama
            avatar: profile.photos?.[0]?.value || '', // Ambil avatar foto profil
            role: 'user', // Tentukan role default sebagai 'user'
          });

          // Simpan pengguna baru ke database
          await user.save();
        }

        // Kirimkan pengguna ke passport
        done(null, user);
      } catch (error) {
        console.error('Google Auth Error:', error);
        done(error, null);
      }
    }
  )
);

// Serialize: simpan ID pengguna ke session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize: ambil data pengguna lengkap berdasarkan ID session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.error('Deserialize Error:', error);
    done(error, null);
  }
});

module.exports = passport;
