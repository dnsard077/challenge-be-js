const express = require('express');
const authController = require('@controllers/authController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });
const router = express.Router();
router.post('/login', authController.login);
router.post('/register', upload.single('image'), authController.register);

module.exports = router;
