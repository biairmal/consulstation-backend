const { consultantController } = require('../controllers')
const { Router } = require('express')
const { verifyToken } = require('../middlewares')
const { getStorage } = require('../../../config/cloudinary')
const multer = require('multer')
const storage = getStorage('avatar')
const upload = multer({ storage })

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
router.post(
  '/consultant/avatar',
  verifyToken,
  upload.single('profilePicture', { public_id: 'consultant_avatar' }),
  consultantController.updateAvatar
)
router.delete(
  '/consultant/avatar',
  verifyToken,
  consultantController.deleteAvatar
)

module.exports = router
