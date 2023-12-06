const Store = require('../models/store');

module.exports = {
  new: newStore,
  create,
  show
}

function newStore(req, res) {
  res.render('stores/new');
}

async function create(req, res) {
  req.body.owner = res.locals.user._id;
  try {
    await Store.create(req.body);
    res.redirect(`/users/${res.locals.user._id}`);
  } catch (err) {
    console.log(err);
  }
}

async function show(req, res) {
  const store = await Store.findById(req.params.id);
  res.render('stores/show', {
    store,
    owner: res.locals.user.name
  });
}
