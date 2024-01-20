const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле обязательно к заполнению'],
      minlength: [2, 'Минимальная длина - 2 символа'],
      maxlength: [30, 'Максимальная длина - 30 символов'],
    },
    link: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректный URL',
      },
      required: [true, 'Поле обязательно к заполнению'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      default: '',
    }],
    createdAt: [{
      type: Date,
      default: Date.now,
    }],
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('card', cardSchema);
