const { authServices } = require('../services')
const { validationErrorHandler } = require('../helpers')

exports.register = async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body

  try {
    await authServices.register(username, email, password, firstName, lastName)

    return res.status(201).json({
      success: true,
      message: 'User stored successfully!',
    })
  } catch (err) {
    console.log('Errors: ', err)
    const errorMessage = validationErrorHandler(err)
    const statusCode = typeof errorMessage === 'object' ? 400 : 500

    return res.status(statusCode).json({
      success: false,
      message: 'Failed to register!',
      errors: errorMessage,
    })
  }
}

exports.logout = async (req, res) => {
  const { refreshToken } = req.body

  try {
    await authServices.deleteRefreshToken(refreshToken)
    res.cookie('token', '', { maxAge: 1 })
    res.cookie('refreshToken', '', { maxAge: 1 })

    return res.status(200).json({
      success: true,
      message: 'Successfully logged user out!',
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: 'Failed to log user out!',
    })
  }
}

exports.login = async (req, res) => {
  const { username, password } = req.body

  try {
    if (username === '' || password === '') {
      return res.status(400).json({
        success: false,
        message: 'Failed to login!',
        errors: 'Username or password can not be null!',
      })
    }

    const user = await authServices.login(username, password)

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Failed to login!',
        errors: 'Invalid credentials!',
      })
    }

    const [token, refreshToken] = authServices.createTokens(user._id, user.role)
    await authServices.saveRefreshToken(refreshToken, user._id, user.role)

    res.cookie('token', token, {
      maxAge: process.env.ACCESS_TOKEN_LIFE,
    })
    res.cookie('refreshToken', token, {
      maxAge: process.env.REFRESH_TOKEN_LIFE,
    })

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      data: {
        token,
        refreshToken,
        role: user.role,
      },
    })
  } catch (err) {
    console.log('Errors: ', err)

    return res.status(500).json({
      success: false,
      message: 'Failed to login!',
      errors: err,
    })
  }
}

exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body

  try {
    if (username === '' || password === '') {
      return res.status(400).json({
        success: false,
        message: 'Failed to login!',
        errors: 'Username or password can not be null!',
      })
    }

    const admin = await authServices.loginAdmin(username, password)

    if (!admin) {
      return res.status(400).json({
        success: false,
        message: 'Failed to login!',
        errors: 'Invalid credentials!',
      })
    }

    const [token, refreshToken] = authServices.createTokens(
      admin._id,
      admin.role
    )
    await authServices.saveRefreshToken(refreshToken, admin._id, admin.role)

    res.cookie('token', token, {
      maxAge: process.env.ACCESS_TOKEN_LIFE,
    })
    res.cookie('refreshToken', token, {
      maxAge: process.env.REFRESH_TOKEN_LIFE,
    })

    if (!admin) {
      return res.status(200).json({
        success: false,
        message: 'Failed to login!',
        errors: 'Invalid credentials!',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      data: {
        token,
        refreshToken,
        role: admin.role,
      },
    })
  } catch (err) {
    console.log('Errors: ', err)

    return res.status(500).json({
      success: false,
      message: 'Failed to login!',
      errors: err,
    })
  }
}

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body
  try {
    const [newToken, newRefreshToken, userId, userRole] =
      await authServices.refreshAccessToken(refreshToken)
    await authServices.saveRefreshToken(newRefreshToken, userId, userRole)

    return res.status(201).json({
      success: true,
      message: 'Succesfully created new access token!',
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
        role: userRole,
      },
    })
  } catch (err) {
    console.log('Errors: ', err)
    return res.sendStatus(err)
  }
}
