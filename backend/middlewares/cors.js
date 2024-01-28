const allowedCors = [
  'https://paulmoskow.students.nomoredomainsmonster.ru',
  'http://paulmoskow.students.nomoredomainsmonster.ru',
  'https://api.paulmoskow.students.nomoredomainsmonster.ru',
  'http://api.paulmoskow.students.nomoredomainsmonster.ru',
  'https://localhost:3000',
  'http://localhost:3000',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = (req, res, next) => {
  const { origin, method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  res.header('Access-Control-Allow-Credentials', true);

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
};
