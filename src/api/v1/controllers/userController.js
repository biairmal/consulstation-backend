const { userServices } = require('../services')

exports.getUsers = async (req, res) => {
  const { role } = req.user
  try {
    if (role !== 'admin') return res.sendStatus(403)
    
    const data = await userServices.getUsers()

    return res.status(200).json({
      success: true,
      message: 'Successfully retreived users!',
      data,
    })
  } catch (err) {
    console.log(err)

    return res.status(500).json({
      success: false,
      message: 'Failed to retreive users!',
      errors: err,
    })
  }
}

exports.getProfile = async (req, res) => {
  const userId = req.user.id

  try {
    const user = await userServices.getUserById(userId)

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user id!',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully retreived user information!',
      data: user,
    })
  } catch (err) {
    console.log(err)

    return res.status(500).json({
      succcess: false,
      message: 'Failed to retreive user information!',
      errors: err,
    })
  }
}

exports.updateProfile = async (req, res) => {
  const userId = req.user.id
  const data = req.body

  try {
    const result = await userServices.updateUserById(userId, data)

    return res.status(200).json({
      succcess: true,
      message: 'Successfully updated user profile!',
      data: result,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update user profile',
      errors: err,
    })
  }
}

exports.updateAvatar = async (req, res) => {
  const userId = req.user.id
  const { path, filename } = req.file

  const picture = {
    filename: filename,
    url: path,
  }

  try {
    const result = await userServices.updateAvatar(userId, picture)

    return res.status(200).json({
      success: true,
      message: 'Successfully updated avatar!',
      data: result,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update user avatar!',
      errors: err,
    })
  }
}

exports.deleteAvatar = async (req, res) => {
  const userId = req.user.id

  try {
    const result = await userServices.deleteAvatar(userId)

    return res.status(200).json({
      success: true,
      message: 'Successfully deleted avatar!',
      data: result,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete user avatar!',
      error: err,
    })
  }
}
