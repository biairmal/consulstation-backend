const { Partnership, User } = require('../models')

const queryConfig = { password: 0 }

exports.getPartnerships = () => {
  return Partnership.find({}, queryConfig)
}

exports.createPartnership = async (form, user) => {
  const userData = await User.findOne({ _id: user.id })

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
    cv: form.cv,
    startingYear: form.startingYear,
  })

  return partnership.save()
}

exports.acceptPartnership = async (id) => {
  try {
    const partnership = await Partnership.findOne({ _id: id })

    if (partnership) {
      partnership.accepted = true
      return partnership.save()
    }
    return null
  } catch (err) {
    throw err
  }
}
