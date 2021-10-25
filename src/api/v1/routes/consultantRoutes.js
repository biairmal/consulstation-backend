const { consultantController } = require('../controllers')
const { Router } = require('express')
const { verifyToken } = require('../middlewares')

const router = Router()

router.get('/consultants', consultantController.getConsultants)
router.get(
  '/consultant/profile',
  verifyToken,
  consultantController.getConsultantProfile
)
router.get(
  '/consultant/:consultantId',
  consultantController.getPublicConsultantProfile
)
router.patch(
  '/consultant/profile/update',
  verifyToken,
  consultantController.updateProfile
)

module.exports = router
