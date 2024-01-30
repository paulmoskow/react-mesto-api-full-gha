const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const Conflict = require('../errors/conflict');
const UnauthorizedAccess = require('../errors/unauthorizedaccess');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SOLT_ROUND = 10;
const UNAUTHORIZED_ACCESS = 401;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name, about, avatar } = req.body;

  bcrypt.hash(password, SOLT_ROUND)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      if (!user) {
        throw new ValidationError('Переданы некорректные данные при создании пользователя');
      }
      return res.status(201).send({
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new Conflict('Такой пользователь уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

// send cookie after authentication
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      return res
        .cookie('jwt', token, {
          maxAge: 604800000,
          httpOnly: true,
        })
        .json({ message: 'Успешная авторизация', user });
    })
    .catch((err) => {
      if (err.code === UNAUTHORIZED_ACCESS) {
        next(new UnauthorizedAccess('Необходима авторизация'));
      } else {
        next(err);
      }
    });
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      try {
        return res.status(200).send({ data: user });
      } catch (err) {
        if (err instanceof ValidationError) {
          throw new ValidationError('Переданы некорректные данные при создании пользователя');
        }
      }
    })
    .catch(next);
};

module.exports.getUserData = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      try {
        return res.status(200).send({ data: user });
      } catch (err) {
        if (err instanceof ValidationError) {
          throw new ValidationError('Переданы некорректные данные при создании пользователя');
        }
      }
    })
    .catch(next);
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    { _id: req.user._id },
    { name: name, about: about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      try {
        return res.status(200).send({ data: user });
      } catch (err) {
        if (err instanceof ValidationError) {
          throw new ValidationError('Переданы некорректные данные при создании пользователя');
        }
      }
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    { _id: req.user._id },
    { avatar: avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      try {
        return res.status(200).send({ data: user });
      } catch (err) {
        if (err instanceof ValidationError) {
          throw new ValidationError('Переданы некорректные данные при создании пользователя');
        }
      }
    })
    .catch(next);
};
