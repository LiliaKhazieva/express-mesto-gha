const Card = require('../models/card');
const { errorHandler } = require('../utils/errorHandler');
const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

// return all cards
const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => {
      errorHandler(HTTP_STATUS_INTERNAL_SERVER_ERROR, 'На сервере произошла ошибка.', res);
    });
};

// create card
const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        errorHandler(HTTP_STATUS_BAD_REQUEST, 'Переданы некорректные данные при создании карточки.', res);
      } else {
        errorHandler(HTTP_STATUS_INTERNAL_SERVER_ERROR, 'На сервере произошла ошибка.', res);
      }
    });
};

const deleteCard = (req, res) => {
  Card.findOneAndDelete({
    _id: req.params.cardId,
    owner: req.user._id,
  })
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        errorHandler(HTTP_STATUS_BAD_REQUEST, 'Переданы некорректные данные для удаления карточки.', res);
      } else if (err.name === 'DocumentNotFoundError') {
        errorHandler(HTTP_STATUS_NOT_FOUND, 'Карточка с указанным _id не найдена.', res);
      } else {
        errorHandler(HTTP_STATUS_INTERNAL_SERVER_ERROR, 'На сервере произошла ошибка.', res);
      }
    });
};

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .orFail()
  .populate(['owner', 'likes'])
  .then((card) => {
    res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      errorHandler(HTTP_STATUS_BAD_REQUEST, 'Переданы некорректные данные для постановки/снятии лайка.', res);
    } else if (err.name === 'DocumentNotFoundError') {
      errorHandler(HTTP_STATUS_NOT_FOUND, 'Передан несуществующий _id карточки.', res);
    } else {
      errorHandler(HTTP_STATUS_INTERNAL_SERVER_ERROR, 'На сервере произошла ошибка.', res);
    }
  });

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .orFail()
  .populate(['owner', 'likes'])
  .then((card) => {
    res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      errorHandler(HTTP_STATUS_BAD_REQUEST, 'Переданы некорректные данные для постановки/снятии лайка.', res);
    } else if (err.name === 'DocumentNotFoundError') {
      errorHandler(HTTP_STATUS_NOT_FOUND, 'Передан несуществующий _id карточки.', res);
    } else {
      errorHandler(HTTP_STATUS_INTERNAL_SERVER_ERROR, 'На сервере произошла ошибка.', res);
    }
  });

module.exports = {
  getCards, createCard, likeCard, dislikeCard, deleteCard,
};
