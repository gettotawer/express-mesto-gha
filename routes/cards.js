const routerCards = require('express').Router();

const {
  createCard, getAllCards, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

routerCards.post('/', createCard);
routerCards.get('/', getAllCards);
routerCards.delete('/:id', deleteCardById);
routerCards.put('/:id/likes', likeCard);
routerCards.delete('/:id/likes', dislikeCard);

module.exports = routerCards;
