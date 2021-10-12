const controller = require('../controllers/userController')
const { Router } = require('express')
const { verifyToken } = require('../middlewares')

const router = Router()

router.get('/users', verifyToken, controller.getUser)

module.exports = router
