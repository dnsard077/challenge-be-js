const userController = require('@controllers/userController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });
const express = require('express');

const router = express.Router();
router.get('/', userController.getUsers);
router.get('/:userid', userController.getUserById);
router.post('/', upload.single('image'), userController.addCustomer);
router.put('/:userid', upload.single('image'), userController.updateCustomer);
router.delete('/:userid', userController.deleteCustomer);

module.exports = router;
