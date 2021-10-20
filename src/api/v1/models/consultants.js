const mongoose = require('mongoose')
const { isEmail } = require('validator')

const consultantSchema = new mongoose.Schema({
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
    required: [true, 'Phone can not be blank'],
  },
  npwp: {
    type: String,
    required: [true, 'NPWP can not be blank'],
  },
  cv: {
    type: String,
    required: [true, 'CV can not be blank'],
  },
  startingYear: {
    type: Number,
    required: [true, 'Starting year can not be blank'],
  },
  totalIncome : {
    type: Number,
    default: 0
  },
  uncollectedIncome : {
    type: Number,
    default: 0
  },
  contracts : Array,
  availability : {
    type: Boolean,
    default: false
  },
  profilePicture : {
    type: String,
    required: [true, 'Profile picture can not be blank']
  },
  verifiedAt : Date
})


module.exports = mongoose.model('Consultant', consultantSchema)
