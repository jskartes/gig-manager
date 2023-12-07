const Store = require('../models/store');

module.exports = {
  index,
  new: newStore,
  create,
  show,
  showCalendar
}

async function index(req, res) {
  const stores = await Store.find({});
  res.render('stores/index', { stores });
}

function newStore(req, res) {
  if (res.locals.user) return res.render('stores/new');
  res.redirect('/auth/google');
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
  const userIsAdmin = store.owner.equals(res.locals.user?._id);
  res.render('stores/show', { store, userIsAdmin });
}

async function showCalendar(req, res) {
  const store = Store.findById(req.params.id);
  res.render('stores/calendar', { store });
}
