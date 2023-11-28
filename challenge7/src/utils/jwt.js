const jwt = require('jsonwebtoken');
const response = require('@utils/response');

const { JWT_SECRET_KEY } = process.env;
async function auth(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    return response.res401(res);
  }
  jwt.verify(authorization, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return response.res401(res);
    }
    req.user = decoded;
    next();
  });
}
async function JWTsign(user) {
  const token = jwt.sign(user, JWT_SECRET_KEY, { expiresIn: '1h' });
  return token;
}
const generateResetToken = (username) => {
  const token = jwt.sign({ username, issuedAt: Date.now() }, JWT_SECRET_KEY, { expiresIn: '1h' });
  return token;
};
const validateResetToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    return decoded.exp > Math.floor(Date.now() / 1000);;
  } catch (error) {
    return false;
  }
};
module.exports = {
  auth,
  JWTsign,
  generateResetToken,
  validateResetToken,
};
