const Card = require('../models/card');

const ERROR_INVALID = 400;
const ERROR_NOTFOUND = 404;
const ERROR_DEFAULT = 500;

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id }).then((cardData) => {
    res.send(cardData);
  }).catch((error) => {
    switch (error.name) {
      case 'ValidationError':
        return res.status(ERROR_INVALID).send({ message: 'Переданы некорректные данные при создании карточки.' });
      default:
        return res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка.' });
    }
  });
};

const getAllCards = (req, res) => {
  Card.find({}).populate('owner').then((cards) => {
    res.send(cards);
  }).catch(() => res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка.' }));
};

const deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.id).populate('owner').then((card) => {
    if (!card) {
      return res.status(ERROR_NOTFOUND).send({ message: 'Карточка с указанным _id не найдена.' });
    }
    return res.send(card);
  }).catch((error) => {
    switch (error.name) {
      case 'CastError':
        return res.status(ERROR_INVALID).send({ message: 'Передан несуществующий _id карточки.' });
      default:
        return res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка.' });
    }
  });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } }, {
    new: true, // обработчик then получит на вход обновлённую запись
  }).populate('likes')
    .then((card) => {
      if (!card) {
        return res.status(ERROR_NOTFOUND).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.send(card);
    }).catch((error) => {
      switch (error.name) {
        case 'CastError':
          return res.status(ERROR_INVALID).send({ message: 'Передан несуществующий _id карточки.' });
        default:
          return res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка.' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }, {
    new: true, // обработчик then получит на вход обновлённую запись
  }).populate('likes')
    .then((card) => {
      if (!card) {
        return res.status(ERROR_NOTFOUND).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.send(card);
    }).catch((error) => {
      switch (error.name) {
        case 'CastError':
          return res.status(ERROR_INVALID).send({ message: 'Переданы некорректные данные для снятии лайка.' });
        default:
          return res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка.' });
      }
    });
};

module.exports = {
  createCard,
  getAllCards,
  deleteCardById,
  likeCard,
  dislikeCard,
};
