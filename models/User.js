const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  nickname: {
    type: String,
    required: true,
    minLength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
    default: '/avatar/noavatar.jpg',
  },
  signature: {
    type: String,
    default: '',
    minLength: 6
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  role: {
    type: String,
    default: 'register',
  },
});

module.exports = mongoose.model('User', UserSchema);