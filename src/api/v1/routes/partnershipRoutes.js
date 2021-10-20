const { partnershipController } = require('../controllers')
const { Router } = require('express')
const { verifyToken } = require('../middlewares')

const router = Router()

router.get(
  '/partnerships',
  verifyToken,
  partnershipController.getPartnershipRequests
)
router.post(
  '/partnership',
  verifyToken,
  partnershipController.createPartnershipRequests
)

router.post(
  '/partnership/:id/accept',
  verifyToken,
  partnershipController.acceptPartnershipRequest
)

module.exports = router
