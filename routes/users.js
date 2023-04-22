const express = require('express');
const {
  getUsers, getUser, createUser, changeUserInfo, changeUserAvatar,
} = require('../controllers/users');

const userRouter = express.Router();

userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUser);
userRouter.post('/users', createUser);

userRouter.patch('/users/me', changeUserInfo);
userRouter.patch('/users/me/avatar', changeUserAvatar);

module.exports = userRouter;
