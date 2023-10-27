const express = require('express');
const transactionController = require('@controllers/transactionController');

const router = express.Router();
router.get('/', (req, res) => { transactionController.getTransactions(req, res); });
router.get('/:transactionId', (req, res) => { transactionController.getTransactionDetails(req, res); });
router.post('/', (req, res) => { transactionController.createTransaction(req, res); });

module.exports = router;
