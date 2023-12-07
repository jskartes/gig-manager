const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/services');

router.get('/stores/:id/services/new', servicesController.new);
router.get(
  '/stores/:storeid/services/:serviceid/edit',
  servicesController.edit
);
router.post('/stores/:id/services', servicesController.create);
router.put('/stores/:storeid/services/:serviceid', servicesController.update);

module.exports = router;
