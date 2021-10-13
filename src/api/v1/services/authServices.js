const { User } = require('../models')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

let availableRefreshTokens = []

exports.generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_LIFE,
  })
}

exports.generateRefreshToken = (id) => {
  // i will put refresh token to somewhere else in the server later
  const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_LIFE,
  })

  availableRefreshTokens.push(refreshToken)

  return refreshToken
}

exports.refreshAccessToken = (token) => {
  if (token == null) throw 401
  if (!availableRefreshTokens.includes(token)) throw 403
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    console.log(err)
    console.log(user)
    if (err) throw 403
    const newToken = this.generateAccessToken(user.id)
    console.log(newToken)
    return newToken
  })
}

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

    if (result) return user
  }
  console.log(user)
  throw 'Your credentials are incorrect!'
}

exports.handleRegistrationErrors = (err) => {
  let errorObj = {}
  // handling duplicate keys
  if (err.code === 11000) {
    Object.keys(err.keyPattern).forEach((key) => {
      errorObj[key] = `${key} already exists`
    })
    return errorObj
  }

  // handling validation errors
  if (err._message === 'User validation failed') {
    Object.keys(err.errors).forEach((key) => {
      errorObj[key] = err.errors[key].message
    })
    return errorObj
  }
  return err
}
