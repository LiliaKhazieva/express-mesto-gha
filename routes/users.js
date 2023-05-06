const express = require('express');
const {
  getUsers, getUser, getCurrentUser, changeUserInfo, changeUserAvatar,
} = require('../controllers/users');

const userRouter = express.Router();

userRouter.get('/users', getUsers);// all users
userRouter.get('/users/:userId', getUser);// id user
userRouter.get('/me', getCurrentUser);// current user

userRouter.patch('/users/me', changeUserInfo);
userRouter.patch('/users/me/avatar', changeUserAvatar);

module.exports = userRouter;
