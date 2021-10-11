const { User } = require('../models')
const bcrypt = require('bcrypt')

exports.register = async (username, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 12)
  const user = new User({
    username,
    email,
    password: hashedPassword,
  })
  return user.save()
}

exports.login = async (username, password) => {
  const user = await User.findOne({ username })
  const result = await bcrypt.compare(password, user.password)
  if (!user || !result) {
    throw 'Incorrect username or password!'
  }
  return 'Successfully logged in!'
}

exports.handleErrors = (err) => {
  // handling duplicate keys
  if (err.code === 11000) {
    let errorList = []
    Object.keys(err.keyPattern).forEach((key) => {
      errorList.push({
        key: key,
        message: `${key} already exists`,
      })
    })
    return errorList
  }

  //handling validation errors
  if (err._message === 'User validation failed') {
    let errorList = []
    Object.keys(err.errors).forEach((key) => {
      errorList.push({
        key: key,
        message: err.errors[key].message,
      })
    })
    return errorList
  }

  return err
}
