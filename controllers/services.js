const Store = require('../models/store');

module.exports = {
  new: newService,
  create,
  edit,
  update
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

async function edit(req, res) {
  const store = await Store.findById(req.params.storeid).populate('services');
  const service = store.services.id(req.params.serviceid);
  res.render('services/edit', { store, service });
}

async function update(req, res) {
  const store = await Store.findById(req.params.storeid).populate('services');
  const service = store.services.id(req.params.serviceid);
  try {
    service.name = req.body.name;
    service.description = req.body.description || null;
    service.price = req.body.price;
    await store.save();
    res.redirect(`/stores/${store._id}`);
  } catch(err) {
    console.log(err);
    res.redirect(`/stores/${store._id}/services/${service._id}/edit`);
  }
}