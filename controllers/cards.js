const Card = require('../models/card');
const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id }).then((cardData) => {
    res.send(cardData);
  }).catch((error) => {
    if (error.name === 'ValidationError') {
      return next(new ValidationError('Переданы некорректные данные при создании карточки.'));
    }
    return next(error);
  });
};

const getAllCards = (req, res, next) => {
  Card.find({}).populate('owner').then((cards) => {
    res.send(cards);
  }).catch(next);
};

const deleteCardById = (req, res, next) => {
  // eslint-disable-next-line consistent-return
  Card.findById(req.params.id).populate('owner').then((card) => {
    if (!card) {
      return next(new NotFoundError('Карточка с указанным _id не найдена.'));
    }
    if (card.owner._id.toString() !== req.user._id) {
      const customErr = new Error('Вы не являетесь владельцем карточки.');
      customErr.statusCode = 403;
      return next(customErr);
    }
    Card.findByIdAndRemove(req.params.id).populate('owner').then((deletedcard) => res.send(deletedcard))
      .catch((error) => {
        if (error.name === 'CastError') {
          return next(new ValidationError('Передан несуществующий _id карточки.'));
        }
        return next(error);
      });
  }).catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } }, {
    new: true, // обработчик then получит на вход обновлённую запись
  }).populate('likes')
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка с указанным _id не найдена.'));
      }
      return res.send(card);
    }).catch((error) => {
      if (error.name === 'CastError') {
        return next(new ValidationError('Передан несуществующий _id карточки.'));
      }
      return next(error);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }, {
    new: true, // обработчик then получит на вход обновлённую запись
  }).populate('likes')
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка с указанным _id не найдена.'));
      }
      return res.send(card);
    }).catch((error) => {
      if (error.name === 'CastError') {
        return next(new ValidationError('Передан несуществующий _id карточки.'));
      }
      return next(error);
    });
};

module.exports = {
  createCard,
  getAllCards,
  deleteCardById,
  likeCard,
  dislikeCard,
};
