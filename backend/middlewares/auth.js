const jwt = require('jsonwebtoken');
const UnauthorizedAccess = require('../errors/unauthorizedaccess');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new UnauthorizedAccess('Необходима авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new UnauthorizedAccess('Необходима авторизация');
  }

  req.user = payload;

  next();
};
