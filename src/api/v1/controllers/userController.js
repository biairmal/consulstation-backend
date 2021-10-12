const { User } = require('../models')

exports.getUser = async (req, res) => {
  const user = await User.find()
  res.json(user)
}
