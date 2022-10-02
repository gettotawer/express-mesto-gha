const mongoose = require('mongoose');

// const { celebrate, Joi } = require('celebrate');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    // validate: {
    //   validator: (v) => /\w+@\w+\.\w+/.test(v),
    // },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    // validate: {
    //   validator: (v) => /https?:\/\/(?:www\.)?([-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b)*(\/[/\d\w.-]*)*(?:[?])*(.+)*/.test(v),
    // },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});
// userSchema.set('toObject', { useProjection: true, versionKey: false });

module.exports = mongoose.model('user', userSchema);
