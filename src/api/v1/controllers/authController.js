const { authServices } = require('../services')

exports.register = async (req, res) => {
  const { username, email, password } = req.body

  try {
    await authServices.register(
      username,
      email,
      password
    )

    return res.status(201).json({
      success: true,
      message: 'User stored successfully!',
    })
  } catch (err) {
    const errorMessage = authServices.handleErrors(err)

    return res.status(500).json({
      success: false,
      message: errorMessage,
    })
  }
}

exports.login = async (req, res) => {
  const { username, password } = req.body

  try {
    await authServices.login(username, password)

    res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
    })
  } catch (err) {
    console.log(err)

    res.status(500).json({
      success: false,
      message: err,
    })
  }
}
