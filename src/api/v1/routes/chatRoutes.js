const { chatController } = require('../controllers')
const { Router } = require('express')
const { verifyToken } = require('../middlewares')

const router = Router()

router.post('/chat/initiate', verifyToken, chatController.initiateChat)
router.post(
  '/chat/:chatRoomId/message',
  verifyToken,
  chatController.postMessage
)
router.get(
  '/chat/:chatRoomId',
  verifyToken,
  chatController.getConversationsByChatRoomId
)

module.exports = router
