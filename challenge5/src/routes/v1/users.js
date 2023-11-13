const userController = require('@controllers/userController');

const express = require('express');

const router = express.Router();
router.get('/', userController.getUsers);
router.get('/:userid', userController.getUserById);
router.post('/', userController.addCustomer);
router.put('/:userid', userController.updateCustomer);
router.delete('/:userid', userController.deleteCustomer);

module.exports = router;
