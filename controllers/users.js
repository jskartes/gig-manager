const User = require('../models/user');

module.exports = {
  index,
  show
};

async function index(req, res) {
  res.redirect('/users/show');
}

function show(req, res) {
  res.render('users/show');
}
