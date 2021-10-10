const controller = require('../controllers/authController')
const { Router } = require('express')

const router = Router()

router.post('/register', controller.register)
router.post('/login', controller.login)

module.exports = router
