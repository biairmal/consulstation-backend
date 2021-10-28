const mongoose = require('mongoose')
const { Schema } = mongoose
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
      type: Schema.Types.Mixed,
      required: [true, 'Message can not be blank'],
    },
    sender: {
      type: Schema.Types.ObjectId,
      required: [true, 'Sender can not be blank'],
    },
    receiver: {
      type: Schema.Types.ObjectId,
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
    console.log('chatroom: ', chatRoomId)
    console.log('sender: ', sender)
    console.log('message: ', message)
    const { userId, consultantId } = await ChatRoom.findOne({ _id: chatRoomId })
    // check if sender is in chat room
    if (userId.equals(sender) && consultantId.equals(sender)) return null
    // set who is receiving the message
    const receiver = sender === userId ? consultantId : userId

    const newMessage = await this.create({
      chatRoomId: chatRoomId,
      message: message,
      sender: sender,
      receiver: receiver,
      readByRecipients: { readByUserId: sender },
    })

    const senderCollectionsName = userId.equals(sender) ? 'users' : 'consultants'
    const aggregate = await this.aggregate([
      //   // get post where _id = message._id
      { $match: { _id: newMessage._id } },
      //   // do a join on another table called users
      //   // get user whose _id = sender
      {
        $lookup: {
          from: senderCollectionsName,
          localField: 'sender',
          foreignField: '_id',
          as: 'sender',
        },
      },
      { $unwind: '$sender' },
      //   // do a jon on another table called chatrooms
      //   // get chatroom whose _id = chatroomId
      //   {
      //     $lookup: {
      //       from: 'chatrooms',
      //       localField: 'chatRoomId',
      //       foreignField: '_id',
      //       as: 'ChatRoomInfo',
      //     },
      //   },
      //   { $unwind: '$chatRoomInfo' },
      //   { $unwind: '$chatRoomInfo.userIds' },
      //   // do a join on another table called users
      //   // get user whose _id = userIds
      //   {
      //     $lookup: {
      //       from: 'users',
      //       localField: 'chatRoomInfo.userIds',
      //       foreignField: '_id',
      //       as: 'chatRoomInfo.userProfile',
      //     },
      //   },
      //   { $unwind: '$chatRoomInfo.userProfile' },

      //   // group data
      //   {
      //     $group: {
      //       _id: '$chatRoomInfo._id',
      //       messageId: { $last: '$_id' },
      //       chatRoomId: { $last: '$chatRoomInfo._id' },
      //       message: { $last: '$message' },
      //       sender: { $last: '$sender' },
      //       receiver: { $last: '$receiver' },
      //       readByRecipients: { $last: '$readByRecipients' },
      //       chatRoomInfo: { $addToSet: '$chatRoomInfo.userProfile' },
      //       createdAt: { $last: '$createdAt' },
      //       updatedAt: { $last: '$updatedAt' },
      //     },
      //   },
    ])
    return aggregate[0]
  } catch (err) {
    throw err
  }
}

module.exports = mongoose.model('ChatMessage', chatMessageSchema)
