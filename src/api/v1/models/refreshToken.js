const mongoose = require('mongoose')

const refreshTokenSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default:'user'
  }
})

module.exports = mongoose.model('RefreshToken', refreshTokenSchema)
