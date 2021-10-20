const validationErrorHandler = require('../helpers/validationErrorHandler')
const { partnershipServices } = require('../services')

exports.getPartnershipRequests = async (req, res) => {
  try {
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
  const user = req.user

  try {
    const result = await partnershipServices.createPartnership(form, user)

    if (result) {
      res.status(201).json({
        success: true,
        message: 'Successfully created partnership request!',
      })
    }
  } catch (err) {
    // console.log(err)
    const errorMessage = validationErrorHandler(err)

    return res.status(500).json({
      success: false,
      message: 'Failed to create partnership requests!',
      errors: errorMessage,
    })
  }
}

exports.acceptPartnershipRequest = async (req, res) => {
  const { id } = req.params

  try {
    const result = partnershipServices.acceptPartnership(id)

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
    console.log(err)

    return res.status(500).json({
      success: false,
      message: 'Failed to accept a partnership request!',
      errors: err,
    })
  }
}
