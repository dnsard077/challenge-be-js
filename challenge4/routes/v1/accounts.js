const express = require('express');
const accountController = require('@controllers/accountController');

const router = express.Router();
router.get('/', (req, res) => { accountController.getAllAccounts(req, res); });
router.get('/:userid', (req, res) => { accountController.getAccountsByUser(req, res); });
router.post('/:userid', (req, res) => { accountController.addAccountToUser(req, res); });

module.exports = router;
