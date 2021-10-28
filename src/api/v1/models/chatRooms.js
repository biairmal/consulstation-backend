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
    expired: {
      type: Date,
      default: null,
    },
    chats: Array,
    lastMessageSent: Date,
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

module.exports = mongoose.model('ChatRoom', chatRoomSchema)
