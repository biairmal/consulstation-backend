const { User, RefreshToken, Consultant, Admin } = require('../models')
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

exports.saveRefreshToken = async (token, userId, role) => {
  const refreshToken = new RefreshToken({
    refreshToken: token,
    userId: userId,
    role: role,
  })

  return refreshToken.save()
}

exports.deleteRefreshToken = async (token) => {
  let result = null
  try {
    await RefreshToken.findOneAndDelete({ refreshToken: token }).then(
      (data) => {
        result = data
      }
    )
    return result
  } catch (err) {
    throw err
  }
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
  try {
    const user = await User.findOne(searchParams)
    if (user) {
      const result = await bcrypt.compare(password, user.password)
      if (result) return user
    }

    const consultant = await Consultant.findOne(searchParams)
    if (consultant) {
      const result = await bcrypt.compare(password, consultant.password)
      if (result) return consultant
    }

    return null
  } catch (err) {
    throw err
  }
}

exports.loginAdmin = async (username, password) => {
  const searchParams = isEmail(username) ? { email: username } : { username }
  try {
    const admin = await Admin.findOne(searchParams)
    if (admin) {
      const result = await bcrypt.compare(password, user.password)
      if (result) return admin
    }

    return null
  } catch (err) {
    throw err
  }
}
