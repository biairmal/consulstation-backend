const { validationErrorHandler } = require('../helpers')
const { partnershipServices } = require('../services')

exports.getPartnershipRequests = async (req, res) => {
  const { role } = req.user
  try {
    if (role !== 'admin') return res.sendStatus(403)

    const data = await partnershipServices.getPartnerships()

    return res.status(200).json({
      success: true,
      message: 'Successfully retreived partnerships requests!',
      data: data,
    })
  } catch (err) {
    console.log(err)

    return res.status(500).json({
      success: false,
      message: 'Failed to get partnership requests!',
      errors: err,
    })
  }
}

exports.createPartnershipRequests = async (req, res) => {
  const form = req.body
  const { id, role } = req.user
  const cv = req.file

  try {
    if (role !== 'user') return res.sendStatus(403)

    const result = await partnershipServices.createPartnership(id, form, cv)

    if (result) {
      res.status(201).json({
        success: true,
        message: 'Successfully created partnership request!',
      })
    }
  } catch (err) {
    console.log(err)

    const errorMessage = validationErrorHandler(err)
    const statusCode = typeof errorMessage === 'object' ? 400 : 500

    return res.status(statusCode).json({
      success: false,
      message: 'Failed to create partnership requests!',
      errors: errorMessage,
    })
  }
}

exports.acceptPartnershipRequest = async (req, res) => {
  const { id } = req.params
  const { role } = req.user

  try {
    if (role !== 'admin') return res.sendStatus(403)

    const result = await partnershipServices.acceptPartnership(id)

    if (result) {
      return res.status(200).json({
        success: true,
        message: 'Successfully accepted a partnership request!',
        data: result,
      })
    }

    return res.status(200).json({
      success: false,
      message: 'Faiiled to accept a partnership request!',
      errors: 'Invalid partnership id!',
    })
  } catch (err) {
    const errorMessage = validationErrorHandler(err)
    console.log('Errors: ', errorMessage)
    const statusCode = typeof errorMessage === 'object' ? 400 : 500

    return res.status(statusCode).json({
      success: false,
      message: 'Failed to accept a partnership request!',
      errors: errorMessage,
    })
  }
}
