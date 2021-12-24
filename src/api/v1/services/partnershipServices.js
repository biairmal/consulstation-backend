const { Partnership, User, Consultant } = require('../models')

const queryConfig = { password: 0 }

exports.getPartnerships = () => {
  return Partnership.find({}, queryConfig)
}

exports.createPartnership = async (userId, form, cv) => {
  try {

    const now = new Date()
    const thisYear = now.getFullYear()

    if(form.startingYear > thisYear) throw 'Invalid year'
    
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
  } catch (err) {
    throw err
  }
}

exports.acceptPartnership = async (id) => {
  try {
    const partnership = await Partnership.findOne({ _id: id })

    if (!partnership) return null

    partnership.accepted = true
    await partnership.save()

    const consultant = new Consultant({
      username: partnership.username,
      email: partnership.email,
      password: partnership.password,
      firstName: partnership.firstName,
      lastName: partnership.lastName,
      phone: partnership.phone,
      npwp: partnership.npwp,
      startingYear: partnership.startingYear,
      profilePicture: partnership.profilePicture,
      cv: partnership.cv,
    })

    return consultant.save()
  } catch (err) {
    throw err
  }
}
