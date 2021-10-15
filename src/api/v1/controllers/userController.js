const { User } = require('../models')

exports.getUser = async (req, res) => {
  const user = await User.find()

  res.json(user)
}

exports.getProfile = async (req, res) => {
  const userId = req.user.id
  const user = await User.findOne({ _id: userId })

  res.send(user)
}
