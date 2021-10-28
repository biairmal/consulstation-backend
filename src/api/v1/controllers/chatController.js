const { chatServices } = require('../services')
const { validationErrorHandler } = require('../helpers')

exports.initiateChat = async (req, res) => {
  const userId = req.user.id
  const { consultantId } = req.body

  try {
    if (!consultantId) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create chat room!',
        errors: 'ConsultantId is missing',
      })
    }

    const data = await chatServices.createChatRoom(userId, consultantId)

    return res.status(201).json({
      success: true,
      message: 'Successfully retreived a chat room!',
      data: data,
    })
  } catch (err) {
    console.log('Error', err)

    return res.status(500).json({
      success: false,
      message: 'Failed to create chat room!',
      errors: err,
    })
  }
}

exports.postMessage = async (req, res) => {
  const userId = req.user.id
  const { chatRoomId } = req.params
  const { message } = req.body
  try {
    if (!chatRoomId) {
      return res.status(400).json({
        success: false,
        message: 'Failed to post a message',
        errors: 'RoomId params is missing',
      })
    }

    const data = await chatServices.postMessage(chatRoomId, userId, message)

    if (!data) return res.sendStatus(403)

    return res.status(201).json({
      success: true,
      message: 'Successfully post message!',
      data: data,
    })
  } catch (err) {
    console.log('Error', err)
    const errorMessage = validationErrorHandler(err)
    const statusCode = typeof errorMessage === 'object' ? 400 : 500

    return res.status(statusCode).json({
      success: false,
      message: 'Failed to post message!',
      errors: errorMessage,
    })
  }
}

exports.getConversationsByChatRoomId = async (req, res) => {
  const userId = req.user.id
  const { chatRoomId } = req.params
  const query = req.query
  try {
    if (!chatRoomId)
      return res.send(400).json({
        success: false,
        message: 'Failed to get conversations!',
        errors: 'RoomId params is missing',
      })

    const data = await chatServices.getConversationsByChatRoomId(
      chatRoomId,
      userId,
      query
    )

    return res.status(200).json({
      success: true,
      message: 'Successfully retreived conversations!',
      data: data,
    })
  } catch (err) {
    console.log('Error', err)

    return res.status(500).json({
      success: false,
      message: 'Failed to get conversations!',
      errors: err,
    })
  }
}
