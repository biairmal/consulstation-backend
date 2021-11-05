const mongoose = require('mongoose')
const { Schema } = mongoose

const chatRoomSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, 'UserId can not be blank'],
    },
    consultantId: {
      type: Schema.Types.ObjectId,
      required: [true, 'consultantId can not be blank'],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    expiredAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
)

chatRoomSchema.statics.initiateChat = async function (userId, consultantId) {
  try {
    const availableRoom = await this.findOne({
      userId: userId,
      consultantId: consultantId,
    })

    if (availableRoom) {
      return {
        isNew: false,
        chatRoomId: availableRoom._id,
      }
    }

    const newRoom = await this.create({
      userId: userId,
      consultantId: consultantId,
    })

    return {
      isNew: true,
      chatRoomId: newRoom._id,
    }
  } catch (err) {
    console.log('Failed to create chat room', err)
    throw err
  }
}

chatRoomSchema.statics.getChatRoomsByUser = async function (user) {
  try {
    const userObjectId = mongoose.Types.ObjectId(user.id)
    const OTHER_USER_LOOKUP = {}
    const queryConfig = {}
    if (user.role === 'user') {
      OTHER_USER_LOOKUP.collections = 'consultants'
      OTHER_USER_LOOKUP.localField = 'consultantId'
      queryConfig.userId = userObjectId
    } else if (user.role === 'consultant') {
      OTHER_USER_LOOKUP.collections = 'users'
      OTHER_USER_LOOKUP.localField = 'userId'
      queryConfig.consultantId = userObjectId
    }
    console.log(OTHER_USER_LOOKUP)
    return await this.aggregate([
      { $match: queryConfig },
      // join other user info
      {
        $lookup: {
          from: OTHER_USER_LOOKUP.collections,
          localField: OTHER_USER_LOOKUP.localField,
          foreignField: '_id',
          as: 'otherUser',
          pipeline: [
            {
              $project: {
                profilePicture: 1,
                firstName: 1,
                lastName: 1,
                username: 1,
              },
            },
          ],
        },
      },
      { $unwind: '$otherUser' },
      // get the last sent message
      {
        $lookup: {
          from: 'chatmessages',
          localField: '_id',
          foreignField: 'chatRoomId',
          as: 'lastChat',
          pipeline: [{ $sort: { createdAt: -1 } }, { $limit: 1 }],
        },
      },
      // coount unread messages
      {
        $lookup: {
          from: 'chatmessages',
          localField: '_id',
          foreignField: 'chatRoomId',
          as: 'unreadMessages',
          pipeline: [
            {
              $group: {
                _id: '$chatRoomId',
                count: {
                  $sum: {
                    $cond: {
                      if: {
                        $in: [user.id, '$readByRecipients.readByUserId'],
                      },
                      then: 0,
                      else: 1,
                    },
                  },
                },
              },
            },
          ],
        },
      },
      { $unwind: '$unreadMessages' },
      { $set: { unreadMessages: '$unreadMessages.count' } },
    ])
  } catch (err) {
    throw err
  }
}

module.exports = mongoose.model('ChatRoom', chatRoomSchema)
