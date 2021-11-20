const { Article } = require('../models')

exports.createArticle = (title, content, adminId) => {
  const article = new Article({
    title,
    content,
    adminId,
  })

  return article.save()
}

exports.getArticleById = (id) => {
  return Article.findOne({ _id: id })
}

exports.getArticles = (limit, page, searchText) => {
  const skip = limit * page

  return Article.find(
    { title: { $regex: searchText, $options: 'i' } },
    {},
    {
      limit: limit,
      skip: skip,
    }
  )
}

exports.updateArticle = async (id, form) => {
  try {
    const res = await Article.updateOne({ _id: id }, form, {
      runValidators: true,
    })
    console.log(res)
    return 1
  } catch (err) {
    throw err
  }
}

exports.deleteArticleById = (id) => {
  let result = null
  Article.findByIdAndRemove(id).then((data) => {
    result = data
  })

  return result
}
