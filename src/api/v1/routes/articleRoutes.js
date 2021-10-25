const { articleController } = require('../controllers')
const { Router } = require('express')
const verifyToken = require('../middlewares/verifyToken')

const router = Router()

router.post('/article', verifyToken, articleController.createArticle)
router.get('/articles', articleController.getArticles)
router.get('/article/:id', articleController.getArticleById)
router.patch('/article/:id', verifyToken, articleController.updateArticle)
router.delete('/article/:id', verifyToken, articleController.deleteArticle)

module.exports = router
