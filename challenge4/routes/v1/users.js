const userController = require('@controllers/userController');

const express = require('express');

const router = express.Router();
router.get('/', (req, res) => { userController.getUsers(req, res); });
router.get('/:userid', (req, res) => { userController.getUserById(req, res); });
router.post('/', (req, res) => { userController.addCustomer(req, res); });
router.put('/:userid', (req, res) => { userController.updateCustomer(req, res); });
router.delete('/:userid', (req, res) => { userController.deleteCustomer(req, res); });

module.exports = router;
