const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');

// Route to process a new purchase and trigger bonuses
router.post('/', purchaseController.processPurchase);

module.exports = router;