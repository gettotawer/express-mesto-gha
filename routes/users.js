const routerUsers = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getAllUsers, getUserById, updateUserInformation, updateUserAvatar, getUserInformation,
} = require('../controllers/users');

const regUrl = /^https?:\/\/[-a-zA-Z0-9]{2,256}\.([a-zA-Z/]{2,256})*/;

// routerUsers.post('/', createUser);
routerUsers.get('/', getAllUsers);

routerUsers.get('/me', getUserInformation);

routerUsers.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

routerUsers.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInformation);

routerUsers.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(regUrl),
  }),
}), updateUserAvatar);

module.exports = routerUsers;
