const { articleServices } = require('../services')

exports.createArticle = async (req, res) => {
  const { title, content } = req.body
  const adminId = req.user.id

  try {
    await articleServices.createArticle(title, content, adminId)

    return res.status(201).json({
      success: true,
      message: 'Successfully created an article!',
    })
  } catch (err) {
    console.log(err)

    return res.status(500).json({
      success: false,
      message: 'Failed to create an article!',
      errors: err,
    })
  }
}

exports.getArticles = async (req, res) => {
  const limit = parseInt(req.query.limit) || 12
  const page = parseInt(req.query.page) || 0
  const searchText = req.query.search || ''

  try {
    const articles = await articleServices.getArticles(limit, page, searchText)

    return res.status(200).json({
      success: true,
      message: 'Successfully retreived articles!',
      data: articles,
    })
  } catch (err) {
    console.log(err)

    return res.status(500).json({
      success: false,
      message: 'Failed to retreive articles!',
      errors: err,
    })
  }
}

exports.getArticleById = async (req, res) => {
  const { id } = req.params

  try {
    const articles = await articleServices.getArticleById(id)

    return res.status(200).json({
      success: true,
      message: 'Successfully retreived an article!',
      data: articles,
    })
  } catch (err) {
    console.log(err)

    return res.status(500).json({
      success: false,
      message: 'Failed to retreive article!',
      errors: err,
    })
  }
}

exports.deleteArticle = async (req, res) => {
  const { id } = req.params

  try {
    const result = await articleServices.deleteArticleById(id)

    if (!result) {
      return res.status(400).json({
        success: false,
        message: 'Invalid article id!',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully deleted an article!',
    })
  } catch (err) {
    console.log(err)

    return res.status(500).json({
      success: false,
      message: 'Failed to delete an article!',
      errors: err,
    })
  }
}

exports.updateArticle = async (req, res) => {
  const { id } = req.params
  const form = req.body

  try {
    const result = await articleServices.updateArticle(id, form)

    if (!result) {
      return res.status(400).json({
        success: false,
        message: 'Invalid article id!',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully updated an article!',
    })
  } catch (err) {
    console.log(err)

    return res.status(500).json({
      success: false,
      message: 'Failed to delete an article!',
      errors: err,
    })
  }
}
