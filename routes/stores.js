const express = require('express');
const router = express.Router();
const storesController = require('../controllers/stores');

router.get('/', storesController.index);
router.get('/new', storesController.new);
router.get('/:id', storesController.show);
router.get('/:id/calendar', storesController.showCalendar);
router.get('/:storeid/select-time/:timeid', storesController.selectTime);
router.get('/:id/confirm-delete', storesController.confirmDelete);
router.get('/:storeid/show-gig/:gigid', storesController.showGig);
router.post('/', storesController.create);
router.post('/:storeid/book-gig/:timeid', storesController.bookGig);
router.delete('/:id', storesController.delete);

module.exports = router;
