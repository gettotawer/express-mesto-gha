/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { SECRET } = require('../consts/secret');
const User = require('../models/user');
const getUserId = require('../middlewares/getUserId');
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
    })).then((user) => res.send(user.toObject({
      useProjection: true,
    }))).catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при обновлении профиля.'));
      }
      if (err.code === 11000) {
        next(new RegisterError('Пользователь с таким email уже существует'));
      }
      next();
    });
};

// eslint-disable-next-line consistent-return
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!email || !password) {
        throw new ValidationError('Одно или несколько полей не заполнены.');
      }
      if (!user) {
        throw new AuthError('Пользователь не найден или неверный пароль');
      }
      bcrypt.compare(password, user.password)
        .then((isAuth) => {
          if (!isAuth) {
            throw new AuthError('Пользователь не найден или неверный пароль');
          }
          const token = jwt.sign({ _id: user._id }, SECRET, { expiresIn: '7d' });
          return res
            .cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7,
              httpOnly: true,
            })
            .end();
        });
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
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    }
    return res.send(user);
  }).catch((error) => {
    if (error.name === 'CastError') {
      next(new ValidationError('Переданы некорректные данные при поиске пользователя.'));
    }
    next();
  });
};

const updateUserInformation = (req, res, next) => {
  const { name, about } = req.body;
  const id = getUserId(req.cookies.jwt);
  User.findByIdAndUpdate(id._id, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true,
  }).then((user) => {
    res.send(user);
  }).catch((error) => {
    if (error.name === 'CastError') {
      next(new ValidationError('Переданы некорректные данные при поиске пользователя.'));
    }
    if (error.name === 'ValidationError') {
      next(new ValidationError('Переданы некорректные данные при обновлении профиля.'));
    }
    next();
  });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const id = getUserId(req.cookies.jwt);
  User.findByIdAndUpdate(id._id, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true,
  }).then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    }
    res.send(user);
  }).catch((error) => {
    if (error.name === 'CastError') {
      next(new ValidationError('Переданы некорректные данные при поиске пользователя.'));
    }
    if (error.name === 'ValidationError') {
      next(new ValidationError('Переданы некорректные данные при обновлении аватара.'));
    }
    next();
  });
};

const getUserInformation = (req, res, next) => {
  // const id = jwt.verify(req.headers.authorization, SECRET);
  const id = getUserId(req.cookies.jwt);
  User.findById(id._id).then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    }
    return res.send(user);
  }).catch((error) => {
    if (error.name === 'CastError') {
      next(new ValidationError('Переданы некорректные данные при поиске пользователя.'));
    }
    next();
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
