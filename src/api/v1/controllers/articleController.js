const { articleServices } = require('../services')

exports.createArticle = async (req, res) => {
  const { title, content } = req.body
  const adminId = req.user.id

  try {
    await articleServices.createArticle(title, content, adminId)

    res.status(201).json({
      success: true,
      message: 'Successfully created an article!',
    })
  } catch (err) {
    console.log(err)

    res.status(500).json({
      success: false,
      message: 'Failed to create an article!',
      errors: err,
    })
  }
}
