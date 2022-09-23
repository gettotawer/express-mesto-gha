const { createCard, getAllCards, deleteCardById, likeCard, dislikeCard } = require('../controllers/cards');

const routerCards = require('express').Router();

routerCards.post("/", createCard);
routerCards.get("/", getAllCards);
routerCards.delete("/:id", deleteCardById);
routerCards.put("/:id/likes", likeCard);
routerCards.delete("/:id/likes", dislikeCard);

module.exports = routerCards;