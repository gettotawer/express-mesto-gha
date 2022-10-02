const routerUsers = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getAllUsers, getUserById, updateUserInformation, updateUserAvatar, getUserInformation,
} = require('../controllers/users');

const regUrl = /^https?:\/\/[-a-zA-Z0-9]{2,256}\.([a-zA-Z/]{2,256})*/;

// routerUsers.post('/', createUser);
routerUsers.get('/', getAllUsers);
routerUsers.get('/me', getUserInformation);
routerUsers.get('/:id', getUserById);
routerUsers.patch('/me', updateUserInformation);
routerUsers.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    link: Joi.string().required().regex(regUrl),
  }).unknown(true),
}), updateUserAvatar);

module.exports = routerUsers;
