const { cloudinary } = require('../../../config/cloudinary')
const { User } = require('../models')

exports.getUser = async (req, res) => {
  const user = await User.find()

  res.json(user)
}

exports.getProfile = async (req, res) => {
  const userId = req.user.id
  const user = await User.findOne({ _id: userId })

  return res.status(200).json({
    success: true,
    message: 'Successfuly retreived user information!',
    data: user,
  })
}

exports.updateProfile = async (req, res) => {
  const userId = req.user.id
  const data = req.body
  const result = await User.updateOne({ _id: userId }, data, {
    runValidators: true,
  })
  return res.status(201).json({
    success: true,
    message: 'Successfully updated user!',
    data: result,
  })
}

exports.updateAvatar = async (req, res) => {
  const userId = req.user.id
  const { path, filename } = req.file

  const profilePicture = {
    filename: filename,
    url: path,
  }

  try {
    const user = await User.findOne({ _id: userId })

    if (!user) {
      throw 'User not found'
    }

    if (user.profilePicture.filename !== 'default-avatar') {
      await cloudinary.uploader.destroy(user.profilePicture.filename)
    }

    const result = await User.updateOne({ _id: userId }, { profilePicture })

    if (!result.modifiedCount) throw 'Error on update'

    return res.status(200).json({
      success: true,
      message: 'Successfully updated avatar!',
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update user avatar!',
      error: err,
    })
  }
}

exports.deleteAvatar = async (req, res) => {
  const userId = req.user.id
  const defaultAvatarFilename = 'default-avatar'
  const defaultAvatarUrl =
    'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-image-icon-default-avatar-profile-icon-social-media-user-vector-image-209162840.jpg'

  try {
    const user = await User.findOne({ _id: userId })

    if (!user) {
      throw 'User not found'
    }

    const cloudinaryFilename = user.profilePicture.filename
    const profilePicture = {
      filename: defaultAvatarFilename,
      url: defaultAvatarUrl,
    }
    await User.updateOne({ _id: userId }, { profilePicture })
    await cloudinary.uploader.destroy(cloudinaryFilename)

    return res.status(200).json({
      success: true,
      message: 'Successfully deleted avatar!',
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete user avatar!',
      error: err,
    })
  }
}
