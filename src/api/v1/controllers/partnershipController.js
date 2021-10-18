const { Partnership } = require('../models')

const queryConfig = { password: 0 }

exports.getPartnershipRequests = async (req, res) => {
  const requests = await Partnership.find({}, queryConfig)

  return res.status(200).json({
    success: true,
    message: 'Successfully retreived partnerships requests!',
    data: requests,
  })
}

exports.createPartnershipRequests = async (req, res) => {
  const form = req.body

  // username, email, passs, first last name, phone, npwpw, cv, starting year, profpic
}