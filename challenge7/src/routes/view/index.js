const express = require('express');
// const { authenticateToken } = require('@middlewares/auth');
const jwt = require('jsonwebtoken');

const router = express.Router();
const { validateResetToken } = require('@utils/jwt');
// router.use('/users', [authenticateToken], userRoutes);
// router.use('/accounts', [authenticateToken], accountRoutes);
// router.use('/transactions', [authenticateToken], transactionRoutes);

router.get('/register', (req, res) => {
  res.render('register.ejs');
});
router.get('/login', (req, res) => {
  res.render('login.ejs');
});
router.get('/homePage', (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(401).send('Unauthorized');
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const user = decodedToken;
  res.render('homePage.ejs', { user });
});
router.get('/forgotPassword', (req, res) => {
  res.render('forgotPassword.ejs');
});
router.get('/resetPassword', (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(401).send('Unauthorized');
  }
  const isValidToken = validateResetToken(token);
  if (!isValidToken) {
    return res.status(403).send('Invalid Token');
  }
  res.render('resetPassword.ejs');
});
module.exports = router;
