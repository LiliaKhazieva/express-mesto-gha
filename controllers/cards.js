const Card = require('../models/card');
const { errorHandler } = require('../utils/errorHandler');

// return all cards
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => {
      errorHandler(500, 'На сервере произошла ошибка.', res);
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
        errorHandler(400, 'Переданы некорректные данные при создании карточки.', res);
      } else {
        errorHandler(500, 'На сервере произошла ошибка.', res);
      }
    });
};

const deleteCard = (req, res) => {
  Card.findOneAndDelete({
    _id: req.params.cardId,
    owner: req.user._id,
  })
    .orFail()
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        errorHandler(400, 'Переданы некорректные данные для удаления карточки.', res);
      } else if (err.name === 'DocumentNotFoundError') {
        errorHandler(404, 'Карточка с указанным _id не найдена.', res);
      } else {
        errorHandler(500, 'На сервере произошла ошибка.', res);
      }
    });
};

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .orFail()
  .then((card) => {
    res.send(card);
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      errorHandler(400, 'Переданы некорректные данные для постановки/снятии лайка.', res);
    } else if (err.name === 'DocumentNotFoundError') {
      errorHandler(404, 'Передан несуществующий _id карточки.', res);
    } else {
      errorHandler(500, 'На сервере произошла ошибка.', res);
    }
  });

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .orFail()
  .then((card) => {
    res.send(card);
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      errorHandler(400, 'Переданы некорректные данные для постановки/снятии лайка.', res);
    } else if (err.name === 'DocumentNotFoundError') {
      errorHandler(404, 'Передан несуществующий _id карточки.', res);
    } else {
      errorHandler(500, 'На сервере произошла ошибка.', res);
    }
  });

module.exports = {
  getCards, createCard, likeCard, dislikeCard, deleteCard,
};
