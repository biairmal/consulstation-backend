const { Transaction, User, ChatRoom, Consultant } = require('../models')
const midtransClient = require('midtrans-client')

let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
})

exports.createTransaction = async (user, form) => {
  try {
    const orderQuantity = form.quantity || 1
    const price = 50000
    const totalPrice = orderQuantity * price

    const chatRoomInfo = await ChatRoom.findOne({ _id: form.chatRoomId })
    if (chatRoomInfo.isPaid) return 'PAID'

    const userInfo = await User.findOne({ _id: user.id }, { password: 0 })
    const consultantInfo = await Consultant.findOne(
      { _id: chatRoomInfo.consultantId },
      { password: 0 }
    )
    const transaction = new Transaction({
      chatRoomId: form.chatRoomId,
    })
    const consultantName = `${consultantInfo.firstName} ${consultantInfo.lastName}`

    let transactionParams = {
      transaction_details: {
        order_id: transaction.id,
        gross_amount: totalPrice,
      },
      item_details: {
        id: chatRoomInfo.id,
        price: price,
        quantity: orderQuantity,
        name: consultantName,
        category: 'One-time-chat',
      },
      customer_details: {
        first_name: userInfo.firstName,
        last_name: userInfo.lastName,
        email: userInfo.email,
        phone: userInfo.phone,
      },
    }

    const midtransTransaction = await snap.createTransaction(transactionParams)
    await transaction.save()
    return midtransTransaction
  } catch (err) {
    throw err
  }
}

exports.notify = async () => {
  try {
    // PUT LOGIC HERE AFTERE DEPLOYMENT
    snap.transaction.notification(notificationJson).then(async (statusResponse) => {
      let { orderId, transactionStatus, fraudStatus } = statusResponse
      console.log(
        `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
      )
      if (transactionStatus == 'capture') {
        // capture only applies to card transaction, which you need to check for the fraudStatus
        if (fraudStatus == 'challenge') {
          // TODO set transaction status on your databaase to 'challenge'
          return 'PAYMENT STATUS: CREDIT CARD CHALLENGED'

        } else if (fraudStatus == 'accept') {
          // TODO set transaction status on your databaase to 'success'
          await successPayment(orderId)
          return 'PAYMENT STATUS: CREDIT CARD ACCEPTED'
        }
      } else if (transactionStatus == 'settlement') {
        // TODO set transaction status on your databaase to 'success'
        await successPayment(orderId)
        return 'PAYMENT STATUS : SETTLEMENT'
      } else if (transactionStatus == 'deny') {
        // TODO you can ignore 'deny', because most of the time it allows payment retries
        // and later can become success
      } else if (
        transactionStatus == 'cancel' ||
        transactionStatus == 'expire'
      ) {
        // TODO set transaction status on your databaase to 'failure'
        await Transaction.findOneAndUpdate(
          { _id: orderId },
          { paymentStatus: 'FAILED' }
        )
        return 'PAYMENT STATUS: FAILED OR EXPIRED'
      } else if (transactionStatus == 'pending') {
        // TODO set transaction status on your databaase to 'pending' / waiting payment
        await Transaction.findOneAndUpdate(
          { _id: orderId },
          { paymentStatus: 'PENDING' }
        )
        return 'PAYMENT STATUS: PENDING'
      }
    })
  } catch (err) {
    throw err
  }
}

const successPayment = async (orderId) => {
  try {
    const expiredAt = new Date()
    expiredAt.setDate(expiredAt.getDate() + 1)

    const { chatRoomId } = await Transaction.findOneAndUpdate(
      { _id: orderId },
      { paymentStatus: 'PAID' }
    )
    await ChatRoom.findOneAndUpdate(
      { _id: chatRoomId },
      { isPaid: true, expiredAt: expiredAt }
    )
  } catch (err) {
    throw err
  }
}
