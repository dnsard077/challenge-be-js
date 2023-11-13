const express = require('express');
const transactionController = require('@controllers/transactionController');

const router = express.Router();
router.get('/', transactionController.getTransactions);
router.get('/:transactionId', transactionController.getTransactionDetails);
router.post('/', transactionController.createTransaction);

module.exports = router;
