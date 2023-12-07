const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/services');

router.get('/stores/:id/services/new', servicesController.new);
router.post('/stores/:id/services', servicesController.create);

module.exports = router;
