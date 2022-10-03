const Card = require('../models/card');
const getUserId = require('../middlewares/getUserId');
const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const id = getUserId(req.cookies.jwt);
  Card.create({ name, link, owner: id._id }).then((cardData) => {
    res.send(cardData);
  }).catch((error) => {
    if (error.name === 'ValidationError') {
      next(new ValidationError('Переданы некорректные данные при создании карточки.'));
    }
    next();
  });
};

const getAllCards = (req, res, next) => {
  Card.find({}).populate('owner').then((cards) => {
    res.send(cards);
  }).catch(next);
};

const deleteCardById = (req, res, next) => {
  const id = getUserId(req.cookies.jwt);
  // eslint-disable-next-line consistent-return
  Card.findById(req.params.id).populate('owner').then((card) => {
    if (!card) {
      next(new NotFoundError('Карточка с указанным _id не найдена.'));
    }
    if (card.owner._id.toString() !== id._id) {
      const customErr = new Error('Вы не являетесь владельцем карточки.');
      customErr.statusCode = 403;
      next(customErr);
    }
    Card.findByIdAndRemove(req.params.id).populate('owner').then((deletedcard) => res.send(deletedcard))
      .catch((error) => {
        if (error.name === 'CastError') {
          next(new ValidationError('Передан несуществующий _id карточки.'));
        }
        next();
      });
  });
};

const likeCard = (req, res, next) => {
  const id = getUserId(req.cookies.jwt);
  Card.findByIdAndUpdate(req.params.id, { $addToSet: { likes: id._id } }, {
    new: true, // обработчик then получит на вход обновлённую запись
  }).populate('likes')
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
      }
      return res.send(card);
    }).catch((error) => {
      if (error.name === 'CastError') {
        next(new ValidationError('Передан несуществующий _id карточки.'));
      }
      next();
    });
};

const dislikeCard = (req, res, next) => {
  const id = getUserId(req.cookies.jwt);
  Card.findByIdAndUpdate(req.params.id, { $pull: { likes: id._id } }, {
    new: true, // обработчик then получит на вход обновлённую запись
  }).populate('likes')
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
      }
      return res.send(card);
    }).catch((error) => {
      if (error.name === 'CastError') {
        next(new ValidationError('Передан несуществующий _id карточки.'));
      }
      next();
    });
};

module.exports = {
  createCard,
  getAllCards,
  deleteCardById,
  likeCard,
  dislikeCard,
};
