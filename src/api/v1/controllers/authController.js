const bcrypt = require('bcrypt')
const { User } = require('../models')

exports.register = async (req, res) => {
  const { username, email, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 12)
  const user = new User({
    username,
    email,
    password: hashedPassword,
  })
  console.log(user)
  try {
    await user.save()
    res.send('Successfuly stored the user!')
  } catch (err) {
    console.log(err)
    res.send(err.message)
  }
}

exports.login = async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })
  const result = await bcrypt.compare(password, user.password)
  res.send(result)
}
