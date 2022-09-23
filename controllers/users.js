const User = require('../models/user');

const ERROR_INVALID = 400;
const ERROR_NOTFOUND = 404;
const ERROR_DEFAULT = 500;

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar }).then((userData) => {
    res.send(userData);
  }).catch((error) => {
    switch (error.name) {
      case 'ValidationError':
        return res.status(ERROR_INVALID).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      default:
        return res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка.' });
    }
  });
};

const getAllUsers = (req, res) => {
  User.find({}).then((users) => {
    res.send(users);
  }).catch(() => res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка.' }));
};

const getUserById = (req, res) => {
  User.findById(req.params.id).then((user) => {
    if (!user) {
      return res.status(ERROR_NOTFOUND).send({ message: 'Пользователь по указанному _id не найден.' });
    }
    return res.send(user);
  }).catch((error) => {
    switch (error.name) {
      case 'CastError':
        return res.status(ERROR_INVALID).send({ message: 'Переданы некорректные данные при поиске пользователя.' });
      default:
        return res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка.' });
    }
  });
};

const updateUserInformation = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true,
  }).then((user) => {
    res.send(user);
  }).catch((error) => {
    switch (error.name) {
      case 'ValidationError':
        return res.status(ERROR_INVALID).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      case 'CastError':
        return res.status(ERROR_INVALID).send({ message: 'Пользователь с указанным _id не найден' });
      default:
        return res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка' });
    }
  });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true,
  }).then((user) => {
    res.send(user);
  }).catch((error) => {
    switch (error.name) {
      case 'ValidationError':
        return res.status(ERROR_INVALID).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      case 'CastError':
        return res.status(ERROR_INVALID).send({ message: 'Пользователь с указанным _id не найден' });
      default:
        return res.status(ERROR_DEFAULT).send({ message: 'На сервере произошла ошибка.' });
    }
  });
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserInformation,
  updateUserAvatar,
};
