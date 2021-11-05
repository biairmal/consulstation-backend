const { transactionController } = require('../controllers')
const { Router } = require('express')
const { verifyToken } = require('../middlewares')
const router = Router()

router.post(
  '/transaction',
  verifyToken,
  transactionController.createTransaction
)
router.post(
  '/transaction/notification',
  transactionController.notify
)
module.exports = router
