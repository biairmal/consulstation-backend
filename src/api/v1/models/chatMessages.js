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
    chatRoomId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Chat room id can not be blank'],
    },
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
    const { userId, consultantId } = await ChatRoom.findOne({ _id: chatRoomId })
    // check if sender is in chat room
    if (userId.equals(sender) && consultantId.equals(sender)) return null
    // set who is receiving the message
    const receiver = userId.equals(sender) ? consultantId : userId

    const newMessage = await this.create({
      chatRoomId: chatRoomId,
      message: message,
      sender: sender,
      receiver: receiver,
      readByRecipients: { readByUserId: sender },
    })

    const usersCollectionsName = userId.equals(sender)
      ? { sender: 'users', receiver: 'consultants' }
      : { sender: 'consultants', receiver: 'users' }

    const aggregate = await this.aggregate([
      // get message by id
      { $match: { _id: newMessage._id } },

      // join users info
      {
        $lookup: {
          from: usersCollectionsName.sender,
          localField: 'sender',
          foreignField: '_id',
          as: 'sender',
          pipeline: [
            {
              $project: {
                password: 0,
              },
            },
          ],
        },
      },
      { $unwind: '$sender' },

      // join chatroom info
      {
        $lookup: {
          from: 'chatrooms',
          localField: 'chatRoomId',
          foreignField: '_id',
          as: 'chatRoomInfo',
          pipeline: [
            {
              $project: {
                _id: 1,
                userId: 1,
                consultantId: 1,
                createdAt: 1,
              },
            },
          ],
        },
      },
      { $unwind: '$chatRoomInfo' },

      // join receiver info
      {
        $lookup: {
          from: usersCollectionsName.receiver,
          localField: 'receiver',
          foreignField: '_id',
          as: 'receiver',
          pipeline: [
            {
              $project: {
                password: 0,
                npwp: 0,
                cv: 0,
                totalIncome: 0,
                uncollectedIncome: 0,
                contracts: 0,
              },
            },
          ],
        },
      },
      { $unwind: '$receiver' },
    ])
    return aggregate[0]
  } catch (err) {
    throw err
  }
}

chatMessageSchema.statics.getConversationsByChatRoomId = async function (
  chatRoomId,
  user,
  options
) {
  chatRoomId = mongoose.Types.ObjectId(chatRoomId)
  const { userId, consultantId } = await ChatRoom.findOne({ _id: chatRoomId })
  // check if this chatroom belongs to this user
  if (userId.equals(user) && consultantId.equals(user)) return null

  try {
    return this.aggregate([
      // get message by chatroomId
      { $match: { chatRoomId: chatRoomId } },
      { $sort: { createdAt: -1 } },

      // join sender and receiver
      // {
      //   $lookup: {
      //     from: 'users',
      //     let: { sender: '$sender' },
      //     as: 'sender_test',
      //     pipeline: [{ $match: { $expr: { $eq: [userId, '$$sender'] } } }],
      //   },
      // },

      // apply pagination
      { $skip: options.page * options.limit },
      { $limit: options.limit },
      { $sort: { createdAt: 1 } },
    ])
  } catch (err) {
    throw err
  }
}

chatMessageSchema.statics.markMessageAsRead = async function (
  chatRoomId,
  currentUserOnlineId
) {}

module.exports = mongoose.model('ChatMessage', chatMessageSchema)
