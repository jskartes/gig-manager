const Store = require('../models/store');
const User = require('../models/user');

module.exports = {
  index,
  new: newStore,
  create,
  show,
  showCalendar,
  selectTime,
  bookGig,
  showGig,
  confirmDelete,
  delete: deleteStore
}

async function index(req, res) {
  const stores = await Store.find({}).sort({ name: 'asc' });
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
  if (!res.locals.user) return res.redirect('/auth/google');
  const store = await Store.findById(req.params.id).populate({
    path: 'owner',
    model: 'User',
    populate: {
      path: 'availableTimes',
      populate: {
        path: 'forStores',
        model: 'Store'
      }
    }
  }).populate({
    path: 'services'
  }).populate({
    path: 'gigs'
  });
  const userIsAdmin = store.owner.equals(res.locals.user?._id);
  const bookingActive = (req.query.bookingActive === 'true') || false;
  const chosenTime = store.owner.availableTimes.id(req.query.chosenTime);
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
  const userGigs = [];
  store.gigs.forEach(gig => {
    if (gig.client.equals(res.locals.user._id)) userGigs.push(gig);
  });
  res.render('stores/calendar', {
    store,
    userIsAdmin,
    days,
    week: parseInt(req.query.week),
    timeFormat: new Intl.DateTimeFormat('en', {
      timeStyle: 'short'
    }),
    dateFormat: { month: 'numeric', day: 'numeric' },
    bookingActive,
    chosenTime,
    userGigs
  });
}

async function selectTime(req, res) {
  const week = parseInt(req.query.week);
  const bookingActive = req.query.bookingActive;
  const store = await Store.findById(req.params.storeid).populate({
    path: 'owner',
    model: 'User',
    populate: {
      path: 'availableTimes'
    }
  });
  const time = store.owner.availableTimes.id(req.params.timeid);
  time.isSelected = !time.isSelected;
  try {
    await store.owner.save();
  } catch (err) {
    console.log(err);
  }
  res.redirect(`/stores/${store._id}/calendar?week=${week}&bookingActive=${bookingActive}&chosenTime=${time._id}`);
}

async function bookGig(req, res) {
  const store = await Store.findById(req.params.storeid).populate({
    path: 'owner',
    model: 'User',
    populate: {
      path: 'availableTimes'
    }
  }).populate({
    path: 'services'
  });
  const time = store.owner.availableTimes.id(req.params.timeid);
  if (!(await User.findOne({
    _id: res.locals.user._id,
    stores: {
      _id: store._id
    }
  }))) res.locals.user.stores.push(store._id);
  req.body.client = res.locals.user._id;
  req.body.service = store.services.id(req.body.service);
  req.body.startTime = time.startTime;
  req.body.endTime = time.endTime;
  store.gigs.push(req.body);
  store.owner.availableTimes.pull(time._id);
  try {
    await res.locals.user.save();
    await store.save();
    await store.owner.save();
  } catch (err) {
    console.log(err);
  }
  res.redirect(`/stores/${store._id}/calendar?week=0&bookingActive=false`);
}

async function showGig(req, res) {
  const store = await Store.findById(req.params.storeid).populate({
    path: 'gigs'
  });
  const gig = store.gigs.id(req.params.gigid);
  res.render('stores/show-gig', {
    store,
    gig,
    timeFormat: new Intl.DateTimeFormat('en', {
      timeStyle: 'short'
    }),
    dateFormat: { month: 'numeric', day: 'numeric' },
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
