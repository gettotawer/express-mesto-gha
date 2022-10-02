const routerCards = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createCard, getAllCards, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

const regUrl = /^https?:\/\/[-a-zA-Z0-9]{2,256}\.([a-zA-Z/]{2,256})*/;

routerCards.post('/', celebrate({
  body: Joi.object().keys({
    link: Joi.string().required().regex(regUrl),
  }).unknown(true),
}), createCard);
routerCards.get('/', getAllCards);
routerCards.delete('/:id', deleteCardById);
routerCards.put('/:id/likes', likeCard);
routerCards.delete('/:id/likes', dislikeCard);

module.exports = routerCards;
