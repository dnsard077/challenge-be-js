const express = require('express');
const userRoutes = require('@routes/v1/users');
const accountRoutes = require('@routes/v1/accounts');
const transactionRoutes = require('@routes/v1/transactions');
const authRoutes = require('@routes/v1/auth');
// const { authenticateToken } = require('@middlewares/auth');

const router = express.Router();
// router.use('/users', [authenticateToken], userRoutes);
// router.use('/accounts', [authenticateToken], accountRoutes);
// router.use('/transactions', [authenticateToken], transactionRoutes);
router.use('/users', userRoutes);
router.use('/accounts', accountRoutes);
router.use('/transactions', transactionRoutes);
router.use('/auth', authRoutes);

module.exports = router;
