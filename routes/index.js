const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get(
  '/',
  (req, res, next) => res.render('index')
);
router.get(
  '/auth/google',
  passport.authenticate(
    'google',
    { scope: ['profile', 'email'], prompt: 'select_account' }
  )
);
router.get(
  '/oauth2callback',
  passport.authenticate(
    'google',
    { successRedirect: '/users', failureRedirect: '/' }
  )
);
router.get(
  '/logout',
  (req, res) => { 
    req.logout(() => res.redirect('/'));
  }
);

module.exports = router;
