const { User, RefreshToken, Consultant, Admin } = require('../models')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.createTokens = (id, role) => {
  const token = jwt.sign({ id, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_LIFE,
  })
  const refreshToken = jwt.sign(
    { id, role },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_LIFE,
    }
  )

  return [token, refreshToken]
}

exports.refreshAccessToken = async (token) => {
  if (token == null) throw 401

  try {
    const refreshToken = await RefreshToken.findOneAndDelete({
      refreshToken: token,
    }).then((data) => {
      return data
    })

    if (!refreshToken) throw 401

    const [id, role] = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET,
      (err, user) => {
        if (err) throw 403
        return [user.id, user.role]
      }
    )
    const [newToken, newRefreshToken] = this.createTokens(id, role)
    return [newToken, newRefreshToken, id, role]
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
    const consultant = await Consultant.findOne(searchParams)
    if (consultant) {
      const result = await bcrypt.compare(password, consultant.password)
      consultant.role = 'consultant'
      if (result) return consultant
    }

    const user = await User.findOne(searchParams)
    if (user) {
      const result = await bcrypt.compare(password, user.password)
      user.role = 'user'
      if (result) return user
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
      const result = await bcrypt.compare(password, admin.password)
      admin.role = 'admin'
      if (result) return admin
    }

    return null
  } catch (err) {
    throw err
  }
}
