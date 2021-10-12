const { authServices } = require('../services')

exports.register = async (req, res) => {
  const { username, email, password } = req.body

  try {
    const user = await authServices.register(username, email, password)
    const accessToken = authServices.generateAccessToken(user._id)
    const refreshToken = authServices.generateRefreshToken(user._id)

    return res.status(201).json({
      success: true,
      message: 'User stored successfully!',
      accessToken,
      refreshToken,
    })
  } catch (err) {
    console.log(err)
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
    const accessToken = authServices.generateAccessToken(user._id)
    const refreshToken = authServices.generateRefreshToken(user._id)

    // res.cookie('at', accessToken, { httpOnly: true, maxAge: 15 * 1000 })
    res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      accessToken,
      refreshToken,
    })
  } catch (err) {
    console.log(err)

    res.status(500).json({
      success: false,
      message: 'Failed to login!',
      errors: err,
    })
  }
}
