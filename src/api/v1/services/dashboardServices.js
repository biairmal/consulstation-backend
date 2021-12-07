const { Partnership, User, Consultant } = require('../models')

const queryConfig = { password: 0 }

exports.getPartnerships = () => {
  return Partnership.find({}, queryConfig)
}

exports.createPartnership = async (userId, form, cv) => {
  const userData = await User.findOne({ _id: userId })

  const partnership = new Partnership({
    username: userData.username,
    email: userData.email,
    password: userData.password,
    firstName: userData.firstName,
    lastName: userData.lastName,
    phone: userData.phone,
    profilePicture: userData.profilePicture,
    createdBy: userData._id,
    npwp: form.npwp,
    cv: {
      filename: cv.filename,
      url: cv.path,
    },
    startingYear: form.startingYear,
  })

  return partnership.save()
}