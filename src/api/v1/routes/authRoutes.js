const { authController } = require('../controllers')
const { Router } = require('express')

const router = Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.post('/login/admin', authController.loginAdmin)
router.post('/token', authController.refreshToken)

module.exports = router
