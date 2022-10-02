const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SECRET } = require('../consts/secret');

// const SECRET = 'sdqdqsdqsddewcwkehbgvbyudec';

// const createToken = ({ id }) => jwt.sign({ id }, SECRET, { expiresIn: '7d' });

// const isAuthorized = (token) => {
//   try {
//     const id = jwt.verify(token, SECRET);
//     return User.findOne({ _id: id })
//       .then((user) => Boolean(user))
//       .catch(() => false);
//   } catch (error) {
//     return false;
//   }
// };

// eslint-disable-next-line max-len
const isAuthorizedMiddleware = (req, res, next) => jwt.verify(req.headers.authorization, SECRET, (err, data) => {
  if (err) {
    return res.status(401).send({ message: 'Ошибка! Вы не авторизированы.' });
  }
  return User.findOne({ _id: data._id })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: 'Ошибка! Вы не авторизированы.' });
      }
      next();
    })
    .catch(() => res.status(404).send({ message: 'Ошибка! Вы не авторизированы.' }));
});

module.exports = {
  isAuthorizedMiddleware,
};
