/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { SECRET } = require('../consts/secret');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');
const AuthError = require('../errors/authError');
const RegisterError = require('../errors/registerError');

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })).then((user) => res.status(200).send(user.toObject({
      useProjection: true,
    }))).catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при обновлении профиля.'));
      } else if (err.code === 11000) {
        next(new RegisterError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

// eslint-disable-next-line consistent-return
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return next(new AuthError('Пользователь не найден или неверный пароль'));
      }
      bcrypt.compare(password, user.password)
        .then((isAuth) => {
          if (!isAuth) {
            return next(new AuthError('Пользователь не найден или неверный пароль'));
          }
          const token = jwt.sign({ _id: user._id }, SECRET, { expiresIn: '7d' });
          return res
            .cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
            }).send(user.toObject({
              useProjection: true,
            }));
        }).catch(next);
    }).catch(next);
};

const getAllUsers = (req, res, next) => {
  User.find({}).then((users) => {
    res.send(users);
  }).catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.id).then((user) => {
    if (!user) {
      return next(new NotFoundError('Пользователь по указанному _id не найден.'));
    }
    return res.send(user);
  }).catch((error) => {
    if (error.name === 'CastError') {
      return next(new ValidationError('Переданы некорректные данные при поиске пользователя.'));
    }
    return next(error);
  });
};

const updateUserInformation = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true,
  }).then((user) => {
    res.send(user);
  }).catch((error) => {
    if (error.name === 'CastError') {
      return next(new ValidationError('Переданы некорректные данные при поиске пользователя.'));
    }
    if (error.name === 'ValidationError') {
      return next(new ValidationError('Переданы некорректные данные при обновлении профиля.'));
    }
    return next(error);
  });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true,
  }).then((user) => {
    if (!user) {
      return next(new NotFoundError('Пользователь по указанному _id не найден.'));
    }
    return res.send(user);
  }).catch((error) => {
    if (error.name === 'CastError') {
      return next(new ValidationError('Переданы некорректные данные при поиске пользователя.'));
    }
    if (error.name === 'ValidationError') {
      return next(new ValidationError('Переданы некорректные данные при обновлении аватара.'));
    }
    return next(error);
  });
};

const getUserInformation = (req, res, next) => {
  User.findById(req.user._id).then((user) => {
    if (!user) {
      return next(new NotFoundError('Пользователь по указанному _id не найден.'));
    }
    return res.send(user);
  }).catch((error) => {
    if (error.name === 'CastError') {
      return next(new ValidationError('Переданы некорректные данные при поиске пользователя.'));
    }
    return next(error);
  });
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserInformation,
  updateUserAvatar,
  getUserInformation,
  login,
};
