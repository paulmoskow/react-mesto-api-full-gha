const express = require('express');
const mongoose = require('mongoose');
const router = require('express').Router();
const json = require('express').json();
const cookieParser = require('cookie-parser');
const { errors, celebrate, Joi } = require('celebrate');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const ValidationError = require('./errors/validation-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'https://paulmoskow.students.nomoredomainsmonster.ru',
  'http://paulmoskow.students.nomoredomainsmonster.ru',
  'localhost:3000',
];

const app = express();
app.use(cookieParser());

mongoose.connect('mongodb://158.160.138.162:27017/mestodb');

app.use(json);
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// allow CORS
app.use(function(req, res, next) {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.end();
  }

  next();
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
  }).unknown(true),
}), createUser);

app.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res) => {
  if (res.status === 404) {
    throw new ValidationError('Некорректный роут');
  }
});

app.use(router);

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  console.log(err);

  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
