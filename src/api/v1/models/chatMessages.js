const mongoose = require('mongoose')
const { ChatRoom } = require('../models')

const readByRecipientSchema = new mongoose.Schema({
  _id: false,
  readByUserId: String,
  readAt: {
    type: Date,
    default: Date.now(),
  },
})

const MESSAGE_TYPE = {
  text: 'text',
}

const chatMessageSchema = new mongoose.Schema(
  {
    chatRoomId: String,
    message: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Message can not be blank'],
    },
    sender: {
      type: String,
      required: [true, 'Sender can not be blank'],
    },
    receiver: {
      type: String,
      required: [true, 'Receiver can not be blank'],
    },
    type: {
      type: String,
      default: MESSAGE_TYPE.text,
    },
    readByRecipients: [readByRecipientSchema],
  },
  { timestamps: true }
)

chatMessageSchema.statics.postMessageInChatRoom = async function (
  chatRoomId,
  sender,
  message
) {
  try {
    const { userId, consultantId } = await ChatRoom.findOne({ _id: chatRoomId })
    const receiver = sender === userId ? consultantId : userId
    const newMessage = this.create({
      chatRoomId: chatRoomId,
      message: message,
      sender: sender,
      receiver: receiver,
      readByRecipients: { readByUserId: sender },
    })

    return newMessage
  } catch (err) {
    throw err
  }
}

module.exports = mongoose.model('ChatMessage', chatMessageSchema)
