const mongoose = require('mongoose')
const { Schema } = mongoose
const { ChatRoom } = require('../models')

const MESSAGE_TYPE = {
  text: 'text',
}

const MESSAGE_FLOW = {
  user_to_consultant: 'user-to-consultant',
  consultant_to_user: 'consultant-to-user',
}

const readByRecipientSchema = new mongoose.Schema({
  _id: false,
  readByUserId: String,
  readAt: {
    type: Date,
    default: Date.now(),
  },
})

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
    flow: {
      type: String,
      required: [true, 'Message flow can not be blank'],
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
    const messageFlow = userId.equals(sender)
      ? MESSAGE_FLOW.user_to_consultant
      : MESSAGE_FLOW.consultant_to_user

    const newMessage = await this.create({
      chatRoomId: chatRoomId,
      message: message,
      sender: sender,
      receiver: receiver,
      flow: messageFlow,
      readByRecipients: { readByUserId: sender },
    })
    if (messageFlow === MESSAGE_FLOW.user_to_consultant) {
      const aggregate = await this.aggregate([
        // get message by id
        { $match: { _id: newMessage._id } },

        // join users info
        {
          $lookup: {
            from: 'users',
            localField: 'sender',
            foreignField: '_id',
            as: 'sender',
            pipeline: [
              {
                $project: {
                  password: 0,
                  phone: 0,
                },
              },
            ],
          },
        },
        { $unwind: '$sender' },

        // join receiver info
        {
          $lookup: {
            from: 'consultants',
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
                  phone: 0,
                },
              },
            ],
          },
        },
        { $unwind: '$receiver' },

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
      ])
      return aggregate[0]
    } else {
      const aggregate = await this.aggregate([
        // get message by id
        { $match: { _id: newMessage._id } },

        // join users info
        {
          $lookup: {
            from: 'consultants',
            localField: 'sender',
            foreignField: '_id',
            as: 'sender',
            pipeline: [
              {
                $project: {
                  password: 0,
                  npwp: 0,
                  cv: 0,
                  totalIncome: 0,
                  uncollectedIncome: 0,
                  contracts: 0,
                  phone: 0,
                },
              },
            ],
          },
        },
        { $unwind: '$sender' },

        // join receiver info
        {
          $lookup: {
            from: 'users',
            localField: 'receiver',
            foreignField: '_id',
            as: 'receiver',
            pipeline: [
              {
                $project: {
                  password: 0,
                  phone: 0,
                },
              },
            ],
          },
        },
        { $unwind: '$receiver' },

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
      ])
      return aggregate[0]
    }
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
    const messagesByConsultant = await this.aggregate([
      // get message by chatroomId
      { $match: { chatRoomId: chatRoomId } },
      { $sort: { createdAt: -1 } },

      // apply pagination
      { $skip: options.page * options.limit },
      { $limit: options.limit },
      { $sort: { createdAt: 1 } },

      { $match: { flow: MESSAGE_FLOW.consultant_to_user } },
      // join sender
      {
        $lookup: {
          from: 'consultants',
          localField: 'sender',
          foreignField: '_id',
          as: 'sender',
          pipeline: [
            {
              $project: {
                password: 0,
                npwp: 0,
                cv: 0,
                totalIncome: 0,
                uncollectedIncome: 0,
                contracts: 0,
                phone: 0,
              },
            },
          ],
        },
      },
      { $unwind: '$sender' },

      // join receiver
      {
        $lookup: {
          from: 'users',
          localField: 'receiver',
          foreignField: '_id',
          as: 'receiver',
          pipeline: [
            {
              $project: {
                password: 0,
                phone: 0,
              },
            },
          ],
        },
      },
      { $unwind: '$receiver' },

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
    ])
    const messagesByUser = await this.aggregate([
      // get message by chatroomId
      { $match: { chatRoomId: chatRoomId } },
      { $sort: { createdAt: -1 } },

      // apply pagination
      { $skip: options.page * options.limit },
      { $limit: options.limit },
      { $sort: { createdAt: 1 } },

      { $match: { flow: MESSAGE_FLOW.user_to_consultant } },
      // join sender
      {
        $lookup: {
          from: 'users',
          localField: 'sender',
          foreignField: '_id',
          as: 'sender',
          pipeline: [
            {
              $project: {
                password: 0,
                phone: 0,
              },
            },
          ],
        },
      },
      { $unwind: '$sender' },

      // join receiver
      {
        $lookup: {
          from: 'consultants',
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
                phone: 0,
              },
            },
          ],
        },
      },
      { $unwind: '$receiver' },

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
    ])

    let messages = messagesByUser.concat(messagesByConsultant)
    messages = messages.sort(function (x, y) {
      return y.createdAt - x.createdAt
    })

    return messages
  } catch (err) {
    throw err
  }
}

chatMessageSchema.statics.markMessagesAsRead = async function (
  chatRoomId,
  currentUserOnlineId
) {
  try {
    return this.updateMany(
      {
        chatRoomId: chatRoomId,
        'readByRecipients.readByUserId': { $ne: currentUserOnlineId },
      },
      {
        $addToSet: {
          readByRecipients: { readByUserId: currentUserOnlineId },
        },
      },
      {
        multi: true,
      }
    )
  } catch (err) {
    throw err
  }
}

module.exports = mongoose.model('ChatMessage', chatMessageSchema)
