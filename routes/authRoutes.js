const express = require('express');
const passport = require('passport');
const router = express.Router();

// Endpoint untuk login menggunakan Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback setelah login berhasil
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect(`${process.env.CLIENT_URL}/Home`); // Redirect ke halaman utama setelah login
});

// Endpoint untuk logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout Error:', err);
      return res.status(500).json({ message: 'Logout Failed' });
    }

    // Hapus sesi
    req.session.destroy((error) => {
      if (error) {
        console.error('Session Destroy Error:', error);
        return res.status(500).json({ message: 'Failed to destroy session' });
      }

      // Hapus cookie sesi
      res.clearCookie('connect.sid');
      res.redirect(process.env.CLIENT_URL || '/');
    });
  });
});

// Endpoint untuk mendapatkan data pengguna saat ini
router.get('/user', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const { name, email, picture, role } = req.user; // Ambil hanya properti yang diperlukan
  res.json({ user: { name, email, picture, role } }); // Termasuk peran pengguna
});

module.exports = router;
