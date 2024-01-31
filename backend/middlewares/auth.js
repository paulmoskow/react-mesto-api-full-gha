const jwt = require('jsonwebtoken');
const UnauthorizedAccess = require('../errors/unauthorizedaccess');

module.exports = (req, res, next) => {
  // const token = req.cookies.jwt;
  const { authorization } = req.headers;

  if (!authorization.startsWith('Bearer')) {
    throw new UnauthorizedAccess('Необходима авторизация');
  }

  const token = authorization.split('Bearer ')[1];
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new UnauthorizedAccess('Необходима авторизация');
  }

  req.user = payload;

  next();
};
