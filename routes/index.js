const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res, next) => res.render('index'));

router.get('/auth/google', passport.authenticate(
  'google',
  { scope: ['profile', 'email'], prompt: 'select_account' }
));

router.get('/oauth2callback', passport.authenticate(
  'google',
  { successRedirect: '/checkuser', failureRedirect: '/' }
));

router.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});

router.get('/checkuser', (req, res, next) => {
  if (req.user?.isAdmin) res.redirect('/admin');
  else res.redirect('/users');
});

module.exports = router;
