const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { isEmail } = require('validator')

const defaultAvatar = {
  filename: 'default-avatar',
  url: 'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-image-icon-default-avatar-profile-icon-social-media-user-vector-image-209162840.jpg',
}

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
    filename: {
      type: String,
      required: [true, 'CV filename can not be blank'],
    },
    url: {
      type: String,
      required: [true, 'CV url can not be blank'],
    },
  },
  startingYear: {
    type: Number,
    required: [true, 'Starting year can not be blank'],
  },
  totalIncome: {
    type: Number,
    default: 0,
  },
  uncollectedIncome: {
    type: Number,
    default: 0,
  },
  contracts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'ContractPlan',
    },
  ],
  availability: {
    type: Boolean,
    default: false,
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

module.exports = mongoose.model('Consultant', consultantSchema)
