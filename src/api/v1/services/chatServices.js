const { ChatRoom, ChatMessage } = require('../models')

exports.createChatRoom = async (userId, consultantId) => {
  try {
    const result = await ChatRoom.initiateChat(userId, consultantId)

    if (!result) return null

    return result
  } catch (err) {
    throw err
  }
}

exports.postMessage = async (chatRoomId, sender, message) => {
  console.log(chatRoomId)
  try {
    const result = await ChatMessage.postMessageInChatRoom(
      chatRoomId,
      sender,
      message
    )

    if (!result) return null

    global.io.sockets.in(chatRoomId).emit('new message', {
      message: result,
    })
    return result
  } catch (err) {
    throw err
  }
}
