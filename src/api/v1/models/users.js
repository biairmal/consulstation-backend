const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { isEmail } = require('validator')

const defaultAvatar = {
  filename: 'default-avatar',
  url: 'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-image-icon-default-avatar-profile-icon-social-media-user-vector-image-209162840.jpg',
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username can not be blank'],
    lowercase: true,
    unique: true,
    minlength: [6, 'Username can not be less than 6 characters'],
    maxlength: [16, 'Username can not be more than 16 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email can not be blank'],
    unique: true,
    validate: [isEmail, 'Please enter a valid email'],
  },
  password: {
    type: String,
    minlength: [8, 'Password can not be less than 6 characters'],
    maxlength: [24, 'Password can not be more than 24 characters'],
    required: [true, 'Password can not be blank'],
  },
  firstName: {
    type: String,
    required: [true, 'First name can not be blank'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name can not be blank'],
  },
  phone: {
    type: String,
    default: null,
  },
  profilePicture: {
    filename: {
      type: String,
      default: defaultAvatar.filename,
    },
    url: {
      type: String,
      default: defaultAvatar.url,
    },
  },
  verifiedAt: Date,
})

userSchema.pre('save', async function (next) {
  const hashedPassword = await bcrypt.hash(this.password, 12)
  this.password = hashedPassword
  next()
})

module.exports = mongoose.model('User', userSchema)
