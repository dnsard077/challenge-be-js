const jwt = require('jsonwebtoken');
const response = require('@utils/response');

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return response.res401(res);
  }
  const secretKey = process.env.JWT_SECRET_KEY;

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return response.res403(res);
    }

    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
