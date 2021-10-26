const { Consultant } = require('../models')
const { cloudinary } = require('../../../config/cloudinary')

const queryConfig = {
  password: 0,
  npwp: 0,
  totalIncome: 0,
  uncollectedIncome: 0,
  contracts: 0,
  phone: 0,
}

exports.getConsultants = () => {
  return Consultant.find({}, queryConfig)
}

exports.getConsultantById = async (id) => {
  try {
    const consultant = await Consultant.findOne({ _id: id }, { password: 0 })

    if (!consultant) return null
    return consultant
  } catch (err) {
    throw err
  }
}

exports.updateConsultantById = async (id, data) => {
  try {
    const result = await Consultant.updateOne({ _id: id }, data, {
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
    const consultant = await Consultant.findOne({ _id: id })

    if (!consultant) throw 'Consultant not found!'

    if (consultant.profilePicture !== 'default-avatar') {
      await cloudinary.uploader.destroy(consultant.profilePicture.filename)
    }

    const result = await Consultant.updateOne({ _id: id }, { profilePicture })

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
    const consultant = await Consultant.findOne({ _id: id })

    if (!consultant) throw 'Consultant not found'

    const cloudinaryFilename = consultant.profilePicture.filename

    const result = await Consultant.updateOne(
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
