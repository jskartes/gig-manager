const express = require('express');
const router = express.Router();
const storesController = require('../controllers/stores');
const stores = require('../controllers/stores');

router.get('/new', storesController.new);
router.post('/', storesController.create);

module.exports = router;
