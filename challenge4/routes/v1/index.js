const express = require('express');
const userRoutes = require('@routes/v1/users');
const accountRoutes = require('@routes/v1/accounts');
const transactionRoutes = require('@routes/v1/transactions');

const router = express.Router();
router.use('/users', userRoutes);
router.use('/accounts', accountRoutes);
router.use('/transactions', transactionRoutes);

module.exports = router;
