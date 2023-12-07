const Store = require('../models/store');

module.exports = {
  new: newService,
  create
}

async function newService(req, res) {
  const store = await Store.findById(req.params.id);
  if (store.owner._id.equals(res.locals.user?._id)) {
    return res.render('services/new', { store });
  }
  res.redirect('/auth/google');
}

async function create(req, res) {
  const store = await Store.findById(req.params.id);
  store.services.push(req.body);
  try {
    await store.save();
  } catch (err) {
    console.log(err);
  }
  res.redirect(`/stores/${store._id}`);
}
