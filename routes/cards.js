const routerCards = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createCard, getAllCards, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

const regUrl = /^https?:\/\/[-a-zA-Z0-9]{2,256}\.([a-zA-Z/]{2,256})*/;

routerCards.post('/', celebrate({
  body: Joi.object().keys({
    link: Joi.string().required().regex(regUrl),
    name: Joi.string().required().min(2).max(30),
  }),
}), createCard);

routerCards.get('/', getAllCards);

routerCards.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), deleteCardById);

routerCards.put('/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), likeCard);

routerCards.delete('/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), dislikeCard);

module.exports = routerCards;
