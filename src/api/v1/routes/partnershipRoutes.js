const { partnershipController } = require('../controllers')
const { Router } = require('express')
const { verifyToken } = require('../middlewares')
const { getStorage } = require('../../../config/cloudinary')
const multer = require('multer')
const storage = getStorage('cv')
const upload = multer({ storage })
const router = Router()

router.get(
  '/partnerships',
  verifyToken,
  partnershipController.getPartnershipRequests
)
router.post(
  '/partnership',
  verifyToken,
  upload.single('cv', { public_id: 'curriculum_vitae' }),
  partnershipController.createPartnershipRequests
)

router.post(
  '/partnership/:id/accept',
  verifyToken,
  partnershipController.acceptPartnershipRequest
)

module.exports = router
