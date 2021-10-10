const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username can not be blank'],
    lowercase: true,
    minlength: [8, 'Username can not be less than 8 characters'],
    maxlength: [16, 'Username can not be more than 16 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email can not be blank'],
  },
  password: {
    type: String,
    required: [true, 'Password can not be blank'],
  },
})

module.exports = mongoose.model('User', userSchema)
