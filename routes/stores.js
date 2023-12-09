const express = require('express');
const router = express.Router();
const storesController = require('../controllers/stores');

router.get('/', storesController.index);
router.get('/new', storesController.new);
router.get('/:id', storesController.show);
router.get('/:id/calendar', storesController.showCalendar);
router.get('/:storeid/book/:timeid', storesController.bookGig);
router.get('/:id/confirm-delete', storesController.confirmDelete);
router.post('/', storesController.create);
router.delete('/:id', storesController.delete);

module.exports = router;
