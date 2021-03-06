const { userController } = require('../controllers')
const { Router } = require('express')
const { verifyToken } = require('../middlewares')
const { getStorage } = require('../../../config/cloudinary')
const multer = require('multer')
const storage = getStorage('avatar')
const upload = multer({ storage })

const router = Router()

router.get('/users', verifyToken, userController.getUsers)
router.get('/user/profile', verifyToken, userController.getProfile)
router.post('/user/profile/update', verifyToken, userController.updateProfile)
router.post('/user/password/update', verifyToken, userController.changePassword)
router.post(
  '/user/avatar',
  verifyToken,
  upload.single('profilePicture', { public_id: 'user_avatar' }),
  userController.updateAvatar
)
router.delete('/user/avatar', verifyToken, userController.deleteAvatar)

module.exports = router
