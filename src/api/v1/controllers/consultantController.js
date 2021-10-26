const { consultantServices } = require('../services')

exports.getConsultants = async (req, res) => {
  try {
    const data = await consultantServices.getConsultants()

    return res.status(200).json({
      success: true,
      message: 'Successfully retreived consultants!',
      data,
    })
  } catch (err) {
    console.log(err)

    return res.status(500).json({
      success: false,
      message: 'Failed to retreive consultants!',
      errors: err,
    })
  }
}

exports.getConsultantProfile = async (req, res) => {
  const consultantId = req.user.id

  try {
    const consultant = await consultantServices.getConsultantById(consultantId)

    if (!consultant) {
      return res.status(400).json({
        success: false,
        message: 'Invalid consultant id!',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully retreived consultant information!',
      data: consultant,
    })
  } catch (err) {
    console.log(err)

    return res.status(500).json({
      succcess: false,
      message: 'Failed to retreive consultant information!',
      errors: err,
    })
  }
}

exports.getPublicConsultantProfile = async (req, res) => {
  const { consultantId } = req.params

  try {
    const consultant = await consultantServices.getConsultantById(consultantId)

    if (!consultant) {
      return res.status(400).json({
        success: false,
        message: 'Invalid consultant id!',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully retreived consultant information!',
      data: consultant,
    })
  } catch (err) {
    console.log(err)

    return res.status(500).json({
      succcess: false,
      message: 'Failed to retreive consultant information!',
      errors: err,
    })
  }
}

exports.updateProfile = async (req, res) => {
  const consultantId = req.user.id
  const data = req.body

  try {
    const result = await consultantServices.updateConsultantById(
      consultantId,
      data
    )

    return res.status(200).json({
      succcess: true,
      message: 'Successfully updated consultant profile!',
      data: result,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update consultant profile',
      errors: err,
    })
  }
}

exports.updateAvatar = async (req, res) => {
  const consultantId = req.user.id
  const { path, filename } = req.file

  const picture = {
    filename: filename,
    url: path,
  }

  try {
    const result = await consultantServices.updateAvatar(consultantId, picture)

    return res.status(200).json({
      success: true,
      message: 'Successfully updated avatar!',
      data: result,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update consultant avatar!',
      errors: err,
    })
  }
}

exports.deleteAvatar = async (req, res) => {
  const consultantId = req.user.id

  try {
    const result = await consultantServices.deleteAvatar(consultantId)

    return res.status(200).json({
      success: true,
      message: 'Successfully deleted avatar!',
      data: result,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete consultant avatar!',
      error: err,
    })
  }
}

