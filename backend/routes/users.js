const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getUserData,
} = require('../controllers/users');

userRouter.get('/', getUsers);

userRouter.get('/me', getUserData);

userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }).unknown(true),
}), getUserById);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).unknown(true),
}), updateUserProfile);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri(),
  }).unknown(true),
}), updateUserAvatar);

module.exports = userRouter;
