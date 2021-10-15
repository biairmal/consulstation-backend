const { Consultant } = require('../models')

const queryConfig = { password: 0 }

exports.getConsultants = async (req, res) => {
  const consultants = await Consultant.find({}, queryConfig)

  res.json(consultants)
}

exports.getConsultantProfile = async (req, res) => {
  const consultantId = req.user.id
  const consultant = await Consultant.findOne({ _id: consultantId }, queryConfig)

  res.status(200).json({
    success: true,
    message: 'Successfuly retreived user information!',
    data: consultant,
  })
}

exports.getPublicConsultantProfile = async (req, res) => {
  const { consultantId } = req.params
  const consultant = await Consultant.findOne(
    { _id: consultantId },
    queryConfig
  )

  res.status(200).json({
    success: true,
    message: 'Successfully retreived consultant profile',
    data: consultant,
  })
}

exports.updateProfile = async (req, res) => {
  const consultantId = req.user.id
  const data = req.body
  const result = await Consultant.updateOne({ _id: consultantId }, data)

  res.status(201).json({
    success: true,
    message: 'Successfully updated user!',
    data: result,
  })
}
