const { userController } = require('../controllers')
const { Router } = require('express')
const { verifyToken } = require('../middlewares')

const router = Router()

router.get('/users', verifyToken, userController.getUser)
router.get('/profile', verifyToken, userController.getProfile)

module.exports = router
