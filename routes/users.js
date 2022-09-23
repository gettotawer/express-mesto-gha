const { createUser, getAllUsers, getUserById, updateUserInformation, updateUserAvatar } = require('../controllers/users');

const routerUsers = require('express').Router();

routerUsers.post('/', createUser);
routerUsers.get("/", getAllUsers);
routerUsers.get("/:id", getUserById);
routerUsers.patch("/me", updateUserInformation);
routerUsers.patch("/me/avatar", updateUserAvatar);

module.exports = routerUsers;