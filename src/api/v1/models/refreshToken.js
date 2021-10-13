const mongoose = require('mongoose')

const refreshTokenSchema = new mongoose.Schema({
  refrehToken: {
    type: String,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
  iat: Number,
})

// refreshTokenSchema.statics.useRefreshToken = function (refreshToken) {
//     this.find({refreshToken})
// }

module.exports = mongoose.model('RefreshToken', refreshTokenSchema)
