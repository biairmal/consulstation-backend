const mongoose = require('mongoose')
const Schema = mongoose.Schema

const transactionSchema = new mongoose.Schema(
  {
    chatRoomId: {
      type: Schema.Types.ObjectId,
      required: [true, 'ChatRoomId is required'],
    },
    paymentStatus: {
      type: String,
      enum: ['NOT_PAID_YET', 'PAID', 'PENDING', 'FAILED'],
      default: 'NOT_PAID_YET',
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Transaction', transactionSchema)
