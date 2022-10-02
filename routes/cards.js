const routerCards = require('express').Router();

const {
  createCard, getAllCards, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');
const {
  isAuthorizedMiddleware,
} = require('../middlewares/auth');

routerCards.post('/', isAuthorizedMiddleware, createCard);
routerCards.get('/', isAuthorizedMiddleware, getAllCards);
routerCards.delete('/:id', isAuthorizedMiddleware, deleteCardById);
routerCards.put('/:id/likes', isAuthorizedMiddleware, likeCard);
routerCards.delete('/:id/likes', isAuthorizedMiddleware, dislikeCard);

module.exports = routerCards;
