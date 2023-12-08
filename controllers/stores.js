const Store = require('../models/store');

module.exports = {
  index,
  new: newStore,
  create,
  show,
  showCalendar,
  confirmDelete,
  delete: deleteStore
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
  const store = await Store.findById(req.params.id).populate('owner');
  const userIsAdmin = store.owner.equals(res.locals.user?._id);
  res.render('stores/show', {
    store,
    contactEmail: store.owner.email,
    userIsAdmin
  });
}

async function showCalendar(req, res) {
  const store = await Store.findById(req.params.id);
  const months = {
    'Jan': 1,  'Feb': 2,  'Mar': 3,  'Apr': 4,
    'May': 5,  'Jun': 6,  'Jul': 7,  'Aug': 8,
    'Sep': 9,  'Oct': 10, 'Nov': 11, 'Dec': 12
  }
  const now = new Date();
  const days = [];
  for (let i = 0; i < 7; i++) {
    let newDay = new Date(now);
    newDay.setDate(newDay.getDate() + i + (parseInt(req.query.week) * 7));
    const formattedDay = newDay.toString().split(' ');
    days.push({
      day: formattedDay[0],
      month: months[formattedDay[1]],
      date: parseInt(formattedDay[2])
    });
  }
  res.render('stores/calendar', {
    store,
    days,
    week: parseInt(req.query.week)
  });
}

async function confirmDelete(req, res) {
  const store = await Store.findById(req.params.id);
  if (store.owner.equals(res.locals.user?._id)) {
    res.render('stores/confirm-delete', {
      store,
      deleteError: false
    });
  }
}

async function deleteStore(req, res) {
  const store = await Store.findById(req.params.id);
  if (req.body.name === store.name) {
    try {
      await Store.deleteOne({ _id: req.params.id });
      res.redirect(`/users/${res.locals.user._id}`);
    } catch (err) {
      console.log(err);
      res.redirect(`/stores/${store._id}`);
    }
  } else {
    res.render('stores/confirm-delete', {
      store,
      deleteError: true
    });
  }
}
