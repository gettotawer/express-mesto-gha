const routerUsers = require('express').Router();

const {
  getAllUsers, getUserById, updateUserInformation, updateUserAvatar, getUserInformation,
} = require('../controllers/users');
const {
  isAuthorizedMiddleware,
} = require('../middlewares/auth');

// routerUsers.post('/', createUser);
routerUsers.get('/', isAuthorizedMiddleware, getAllUsers);
routerUsers.get('/me', isAuthorizedMiddleware, getUserInformation);
routerUsers.get('/:id', isAuthorizedMiddleware, getUserById);
routerUsers.patch('/me', isAuthorizedMiddleware, updateUserInformation);
routerUsers.patch('/me/avatar', isAuthorizedMiddleware, updateUserAvatar);

module.exports = routerUsers;
