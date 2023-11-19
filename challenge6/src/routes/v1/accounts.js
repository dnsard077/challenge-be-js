const express = require('express');
const accountController = require('@controllers/accountController');

const router = express.Router();
router.get('/', accountController.getAllAccounts);
router.get('/:userid', accountController.getAccountsByUser);
router.post('/:userid', accountController.addAccountToUser);

module.exports = router;
