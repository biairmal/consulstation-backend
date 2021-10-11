const { User } = require('../models')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')

exports.register = async (username, email, password) => {
  const user = new User({
    username,
    email,
    password,
  })

  return user.save()
}

exports.login = async (username, password) => {
  const searchParams = isEmail(username) ? { email: username } : { username }
  const user = await User.findOne(searchParams)
  if (user) {
    const result = await bcrypt.compare(password, user.password)

    if (result) return 'Successfully logged in!'
  }
  throw 'Incorrect username or password!'
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
