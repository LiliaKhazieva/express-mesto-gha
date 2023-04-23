const User = require('../models/user');
const { errorHandler } = require('../utils/errorHandler');
const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

// return all users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      errorHandler(HTTP_STATUS_INTERNAL_SERVER_ERROR, 'На сервере произошла ошибка.', res);
    });
};

// user Id
const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        errorHandler(HTTP_STATUS_BAD_REQUEST, 'Переданы некорректные данные.', res);
      } else if (err.name === 'DocumentNotFoundError') {
        errorHandler(HTTP_STATUS_NOT_FOUND, 'Пользователь с указанным _id не найден.', res);
      } else {
        errorHandler(HTTP_STATUS_INTERNAL_SERVER_ERROR, 'На сервере произошла ошибка.', res);
      }
    });
};

// create user
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
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
        errorHandler(HTTP_STATUS_BAD_REQUEST, 'Переданы некорректные данные при создании пользователя.', res);
      } else {
        errorHandler(HTTP_STATUS_INTERNAL_SERVER_ERROR, 'На сервере произошла ошибка.', res);
      }
    });
};

const changeUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        errorHandler(HTTP_STATUS_BAD_REQUEST, 'Переданы некорректные данные при обновлении профиля.', res);
      } else if (err.name === 'DocumentNotFoundError') {
        errorHandler(HTTP_STATUS_NOT_FOUND, 'Пользователь с указанным _id не найден.', res);
      } else {
        errorHandler(HTTP_STATUS_INTERNAL_SERVER_ERROR, 'На сервере произошла ошибка.', res);
      }
    });
};

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
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        errorHandler(HTTP_STATUS_BAD_REQUEST, 'Переданы некорректные данные при обновлении профиля.', res);
      } else if (err.name === 'DocumentNotFoundError') {
        errorHandler(HTTP_STATUS_NOT_FOUND, 'Пользователь с указанным _id не найден.', res);
      } else {
        errorHandler(HTTP_STATUS_INTERNAL_SERVER_ERROR, 'На сервере произошла ошибка.', res);
      }
    });
};

module.exports = {
  getUsers, getUser, createUser, changeUserInfo, changeUserAvatar,
};
