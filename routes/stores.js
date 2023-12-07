const express = require('express');
const router = express.Router();
const storesController = require('../controllers/stores');

router.get('/', storesController.index);
router.get('/new', storesController.new);
router.get('/:id', storesController.show);
router.get('/:id/calendar', storesController.showCalendar);
router.post('/', storesController.create);

module.exports = router;
