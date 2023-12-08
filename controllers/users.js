const User = require('../models/user');
const Store = require('../models/store');

module.exports = {
  index,
  show,
  showCalendar,
  addAvailableTime,
  confirmDelete,
  delete: deleteUserAccount
}

function index(req, res) {
  if (!res.locals.user) return res.redirect('/auth/google');
  res.redirect(`/users/${res.locals.user._id}`);
}

async function show(req, res) {
  if (!res.locals.user) return res.redirect('/auth/google');
  const stores = await Store.find({ owner: res.locals.user._id });
  res.render('users/show', { stores });
}

async function showCalendar(req, res) {
  const stores = await Store.find({ owner: res.locals.user._id });
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
  res.render('users/calendar', {
    user: res.locals.user,
    stores,
    days,
    week: parseInt(req.query.week)
  });
}

async function addAvailableTime(req, res) {
  const user = await User.findById(req.params.id);
  const stores = await Store.find({ owner: res.locals.user._id });
  const forStores = req.body.forStores.map(forStore => {
    return stores.find(store => store.name === forStore);
  });
  user.availableTimes.push({
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    forStores: forStores
  });
  try {
    await user.save();
    res.redirect(
      `/users/${res.locals.user._id}/calendar?week=${parseInt(req.query.week)}`
    );
  } catch (err) {
    console.log(err);
    res.redirect(`/users/${res.locals.user._id}/calendar?week=0`);
  }
}

function confirmDelete(req, res) {
  res.render('users/confirm-delete', { deleteError: false });
}

async function deleteUserAccount(req, res) {
  const user = await User.findById(req.params.id);
  if (req.body.name === user.name) {
    try {
      await User.deleteOne({ _id: req.params.id });
      res.redirect('/');
    } catch(err) {
      console.log(err);
      res.redirect(`/users/${user._id}`);
    }
  } else {
    res.render('users/confirm-delete', { deleteError: true });
  }
}
