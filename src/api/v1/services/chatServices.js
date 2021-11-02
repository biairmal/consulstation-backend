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

exports.getConversationsByChatRoomId = async (chatRoomId, userId, query) => {
  try {
    const chatRoom = await ChatRoom.findOne({ _id: chatRoomId })
    if (!chatRoom) return null

    const options = {
      page: parseInt(query.page) || 0,
      limit: parseInt(query.limit) || 20,
    }

    const conversations = await ChatMessage.getConversationsByChatRoomId(
      chatRoomId,
      userId,
      options
    )

    return conversations
  } catch (err) {
    throw err
  }
}

exports.markChatAsReadByChatRoomId = async (chatRoomId, userId) => {
  try {
    const room = await ChatRoom.findOne({ _id: chatRoomId })

    if (!room) return null

    const result = await ChatMessage.markMessagesAsRead(chatRoomId, userId)

    return result
  } catch (err) {
    throw err
  }
}

exports.getChatRooms = async (user) => {
  try {
    return await ChatRoom.getChatRoomsByUser(user)
  } catch (err) {
    throw err
  }
}
