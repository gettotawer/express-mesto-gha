const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SECRET } = require('../consts/secret');
const AuthError = require('../errors/authError');

// eslint-disable-next-line max-len
const isAuthorizedMiddleware = (req, res, next) => jwt.verify(req.cookies.jwt, SECRET, (err, data) => {
  if (err) {
    throw new AuthError('Ошибка! Вы не авторизированы.');
  }
  return User.findOne({ _id: data._id })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        throw new AuthError('Ошибка! Вы не авторизированы.');
      }
      next();
    })
    .catch(() => next(new AuthError('Ошибка! Вы не авторизированы.')));
});

module.exports = {
  isAuthorizedMiddleware,
};
