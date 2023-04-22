const User = require('../models/user');
const { errorHandler } = require('../utils/errorHandler');

// return all users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      errorHandler(500, 'На сервере произошла ошибка.', res);
    });
};

// user Id
const getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      console.log('user')
      res.send(user);
    })
    .catch(() => {
      errorHandler(404, 'Пользователь по указанному _id не найден.', res);
    });
}

// create user
const createUser = (req, res) => {
  const { name, about, avatar, } = req.body;
  User.create({
    name,
    about,
    avatar,
  })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        errorHandler(400, 'Переданы некорректные данные при создании пользователя.', res);
      } else {
        errorHandler(500, 'На сервере произошла ошибка.', res);
      }
    });
}

const changeUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.send(user);
    })
    .catch(() => {
      errorHandler(404, 'Пользователь по указанному _id не найден.', res);
    })
}

const changeUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.send(user);
    })
    .catch(() => {
      errorHandler(404, 'Пользователь по указанному _id не найден.', res);
    })
}

module.exports = {
  getUsers, getUser, createUser, changeUserInfo, changeUserAvatar
}