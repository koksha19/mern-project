const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
  let decodedToken;
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    const error = new Error('Not authorized');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  try {
    decodedToken = jwt.verify(token, 'secret');
  } catch (error) {
    error.statusCode = 500;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};

module.exports = isAuth;
