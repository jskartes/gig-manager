const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

router.get('/', usersController.index);
router.get('/:id', usersController.show);
router.get('/:id/confirm-delete', usersController.confirmDelete);
router.delete('/:id', usersController.delete);

module.exports = router;
