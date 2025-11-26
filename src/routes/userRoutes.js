const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route to add a new user
router.post('/', userController.addUser);

// Route to get a specific user and their upline hierarchy (for testing/verification)
router.get('/:id', userController.getUserDetails);

module.exports = router;