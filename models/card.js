const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /https?:\/\/(?:www\.)?([-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b)*(\/[/\d\w.-]*)*(?:[?])*(.+)*/.test(v),
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

module.exports = mongoose.model('card', cardSchema);
