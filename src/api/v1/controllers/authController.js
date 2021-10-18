const { authServices } = require('../services')

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
    const errorMessage = authServices.handleRegistrationErrors(err)

    return res.status(500).json({
      success: false,
      message: 'Failed to register!',
      errors: errorMessage,
    })
  }
}

exports.login = async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await authServices.login(username, password)
    const [token, refreshToken] = authServices.createTokens(user._id)
    await authServices.saveRefreshToken(refreshToken)

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: process.env.ACCESS_TOKEN_LIFE,
    })
    res.cookie('refreshToken', token, {
      httpOnly: true,
      maxAge: process.env.REFRESH_TOKEN_LIFE,
    })

    if(!user) {
      return res.status(200).json({
        success: false,
        message: 'Failed to login!',
        errors: 'Invalid credentials!'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      refreshToken,
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

exports.loginAdmin = async () => {
  const { username, password } = req.body

  try {
    const admin = await authServices.loginAdmin(username, password)
    const [token, refreshToken] = authServices.createTokens(admin._id)
    await authServices.saveRefreshToken(refreshToken)

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: process.env.ACCESS_TOKEN_LIFE,
    })
    res.cookie('refreshToken', token, {
      httpOnly: true,
      maxAge: process.env.REFRESH_TOKEN_LIFE,
    })

    if(!admin) {
      return res.status(200).json({
        success: false,
        message: 'Failed to login!',
        errors: 'Invalid credentials!'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      refreshToken,
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
    const [newToken, newRefreshToken] = await authServices.refreshAccessToken(
      refreshToken
    )
    await authServices.saveRefreshToken(refreshToken)

    res.status(201).json({
      success: true,
      message: 'Succesfully created new access token!',
      accessToken: newToken,
      refreshToken: newRefreshToken,
    })
  } catch (err) {
    console.log('Errors: ', err)
    res.sendStatus(err)
  }
}
