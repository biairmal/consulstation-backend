const { Article } = require('../models')

exports.createArticle = (title, content, adminId) => {
  const article = new Article({
    title,
    content,
    adminId,
  })

  return article.save()
}

exports.getArticle = (idi) => {
  return Article.findOne({ _id: id })
}

exports.getArticles = () => {
  return Article.find({})
}

exports.updateArticle = () => {
  
}