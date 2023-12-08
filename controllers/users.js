const User = require('../models/user');
const Store = require('../models/store');

module.exports = {
  index,
  show,
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
    res.render('/users/confirm-delete', { deleteError: true });
  }
}
