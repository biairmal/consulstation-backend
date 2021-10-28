const { User } = require('../models')
const { cloudinary } = require('../../../config/cloudinary')

const queryConfig = { password: 0 }

exports.getUsers = () => {
  return User.find({}, queryConfig)
}

exports.getUserById = async (id) => {
  try {
    const user = await User.findOne({ _id: id }, queryConfig)

    if (!user) return null
    return user
  } catch (err) {
    throw err
  }
}

exports.updateUserById = async (id, data) => {
  try {
    const result = await User.updateOne({ _id: id }, data, {
      runValidators: true,
    })
    if (!result.modifiedCount) throw 'Nothing was updated'

    return result
  } catch (err) {
    throw err
  }
}

exports.updateAvatar = async (id, picture) => {
  const profilePicture = {
    filename: picture.filename,
    url: picture.url,
  }

  try {
    const user = await User.findOne({ _id: id })

    if (!user) throw 'User not found!'

    if (user.profilePicture !== 'default-avatar') {
      await cloudinary.uploader.destroy(user.profilePicture.filename)
    }

    const result = await User.updateOne({ _id: id }, { profilePicture })

    if (!result.modifiedCount) throw 'Nothing was updated!'

    return result
  } catch (err) {
    throw err
  }
}

exports.deleteAvatar = async (id) => {
  const defaultAvatar = {
    filename: 'default-avatar',
    url: 'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-image-icon-default-avatar-profile-icon-social-media-user-vector-image-209162840.jpg',
  }

  try {
    const user = await User.findOne({ _id: id })

    if (!user) throw 'User not found'

    const cloudinaryFilename = user.profilePicture.filename

    const result = await User.updateOne(
      { _id: id },
      { profilePicture: defaultAvatar }
    )

    await cloudinary.uploader.destroy(cloudinaryFilename)

    if (!result.modifiedCount) throw 'Nothing was updated!'

    return result
  } catch (err) {
    throw err
  }
}
