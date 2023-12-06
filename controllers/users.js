const User = require('../models/user');
const Store = require('../models/store');

module.exports = {
  index,
  show
}

function index(req, res) {
  res.redirect(`/users/${res.locals.user._id}`);
}

async function show(req, res) {
  const stores = await Store.find({ owner: res.locals.user._id });
  res.render('users/show', { stores });
}
