const { validationErrorHandler } = require('../helpers')
const { contractPlanServices } = require('../services')

exports.createContractPlan = async (req, res) => {
  try {
    const user = req.user
    const form = req.body

    if (user.role !== 'consultant') {
      return res.status(403).json({
        success: false,
        message: 'Failed to create contract plan!',
        errors: 'You are not consultant.',
      })
    }

    if (!form.title || !form.description || !form.price) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create contract plan!',
        errors: 'Please fill all required fields (title, description, price).',
      })
    }

    await contractPlanServices.createContractPlan(user.id, form)

    return res.status(201).json({
      success: true,
      message: 'Successfully created contract plan!',
    })
  } catch (err) {
    err = validationErrorHandler(err)
    console.log('Error', err)

    return res.status(500).json({
      success: false,
      message: 'Failed to create contract plan!',
      errors: err,
    })
  }
}

exports.getContractPlansForConsultant = async (req, res) => {
  try {
    const user = req.user
    if (user.role !== 'consultant') {
      return res.status(403).json({
        success: false,
        message: 'Failed to get contract plans!',
        errors: 'You are not consultant.',
      })
    }

    const data = await contractPlanServices.getContractPlansByConsultantId(
      user.id
    )

    return res.status(200).json({
      success: true,
      message: 'Successfully retreived contract plans!',
      data: data,
    })
  } catch (err) {
    console.log('Error', err)

    return res.status(500).json({
      success: false,
      message: 'Failed to get contract plans!',
      errors: err,
    })
  }
}

exports.getContractPlanById = async (req, res) => {
  try {
    const user = req.user
    const { contractPlanId } = req.params
    if (user.role !== 'consultant') {
      return res.status(403).json({
        success: false,
        message: 'Failed to get contract plans!',
        errors: 'You are not consultant.',
      })
    }

    const data = await contractPlanServices.getContractPlanById(contractPlanId)

    return res.status(200).json({
      success: true,
      message: 'Successfully retreived contract plans!',
      data: data,
    })
  } catch (err) {
    console.log('Error', err)

    return res.status(500).json({
      success: false,
      message: 'Failed to get contract plans!',
      errors: err,
    })
  }
}

exports.deleteContractPlanById = async (req, res) => {
  try {
    const user = req.user
    const { contractPlanId } = req.params
    if (user.role !== 'consultant') {
      return res.status(403).json({
        success: false,
        message: 'Failed to delete contract plans!',
        errors: 'You are not consultant.',
      })
    }

    const data = await contractPlanServices.deleteContractPlanById(
      contractPlanId,
      user.id
    )

    return res.status(200).json({
      success: true,
      message: 'Successfully deleted contract plan!',
      data: data,
    })
  } catch (err) {
    console.log('Error', err)

    return res.status(500).json({
      success: false,
      message: 'Failed to delete contract plans!',
      errors: err,
    })
  }
}

exports.updateContractPlanById = async (req, res) => {
  try {
    const user = req.user
    const { contractPlanId } = req.params
    const form = req.body
    if (user.role !== 'consultant') {
      return res.status(403).json({
        success: false,
        message: 'Failed to update contract plans!',
        errors: 'You are not consultant.',
      })
    }

    if (!form.title && !form.description && !form.price) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update contract plan!',
        errors: 'Please fill at least one field (title, description, price).',
      })
    }

    const data = await contractPlanServices.updateContractPlanById(
      contractPlanId,
      user.id,
      form
    )

    return res.status(200).json({
      success: true,
      message: 'Successfully deleted contract plan!',
      data: data,
    })
  } catch (err) {
    console.log('Error', err)

    return res.status(500).json({
      success: false,
      message: 'Failed to delete contract plans!',
      errors: err,
    })
  }
}
