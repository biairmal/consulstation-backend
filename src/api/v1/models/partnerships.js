const mongoose = require('mongoose')
const { isEmail } = require('validator')

const partnershipSchema = new mongoose.Schema({
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
    required: [true, 'Password can not be blank'],
  },
  firstName : String,
  lastName : String,
  phone : String,
  npwp : String,
  cv: String,
  startingYear : Number,
  profilePicture : String,
  accepted: Boolean,
}, { timestamps: { createdAt: 'created_at' } })


module.exports = mongoose.model('Partnership', partnershipSchema)