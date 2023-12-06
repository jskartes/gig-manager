const express = require('express');
const router = express.Router();
const storesController = require('../controllers/stores');
const stores = require('../controllers/stores');

router.get('/new', storesController.new);
router.get('/:id', storesController.show);
router.post('/', storesController.create);

module.exports = router;
