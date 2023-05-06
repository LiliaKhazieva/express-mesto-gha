const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { URL_REGEX } = require('../utils/constants');
const {
  getUsers, getUser, getCurrentUser, changeUserInfo, changeUserAvatar,
} = require('../controllers/users');

const userRouter = express.Router();

userRouter.get('/users', getUsers);// all users
userRouter.get('/users/me', getCurrentUser);// current user
userRouter.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUser);// id user

userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), changeUserInfo);

userRouter.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi
      .string()
      .pattern(URL_REGEX),
  }),
}), changeUserAvatar);

module.exports = userRouter;
