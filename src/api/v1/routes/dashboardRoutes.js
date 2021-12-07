const { dashboardController } = require('../controllers')
const { Router } = require('express')
const verifyToken = require('../middlewares/verifyToken')

const router = Router()

router.get(
  '/dashboard',
  verifyToken,
  dashboardController.getDashboardData
)

module.exports = router
