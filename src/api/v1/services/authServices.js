const { User, RefreshToken, Consultant } = require('../models')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.createTokens = (id) => {
  const token = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_LIFE,
  })
  const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_LIFE,
  })

  return [token, refreshToken]
}

exports.refreshAccessToken = async (token) => {
  let id = null
  let refreshToken = null
  if (token == null) throw 401
  try {
    await RefreshToken.findOneAndDelete({ refreshToken: token }).then(
      (data) => {
        refreshToken = data
      }
    )
    if (!refreshToken) throw 401
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) throw 403
      id = user.id
    })

    return this.createTokens(id)
  } catch (err) {
    throw err
  }
}

exports.saveRefreshToken = async (token) => {
  const refreshToken = new RefreshToken({ refreshToken: token })

  return refreshToken.save()
}

exports.register = async (username, email, password, firstName, lastName) => {
  const user = new User({
    username,
    email,
    password,
    firstName,
    lastName,
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
  const consultant = await Consultant.findOne(searchParams)
  console.log(consultant)

  if (consultant) {
    // const result = await bcrypt.compare(password, consultant.password)
    result = (password === consultant.password)

    if (result) return consultant
  }

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
