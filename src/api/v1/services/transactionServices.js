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

exports.notify = async (midtransNotification) => {
  try {
    // PUT LOGIC HERE AFTERE DEPLOYMENT
    snap.transaction
      .notification(midtransNotification)
      .then(async (statusResponse) => {
        let { order_id, transaction_status, fraud_status } = statusResponse
        console.log('status response: ', statusResponse)
        console.log(
          `Transaction notification received. Order ID: ${order_id}. Transaction status: ${transaction_status}. Fraud status: ${fraud_status}`
        )
        if (transaction_status == 'capture') {
          // capture only applies to card transaction, which you need to check for the fraud_status
          if (fraud_status == 'challenge') {
            // TODO set transaction status on your databaase to 'challenge'
            return 'PAYMENT STATUS: CREDIT CARD CHALLENGED'
          } else if (fraud_status == 'accept') {
            // TODO set transaction status on your databaase to 'success'
            await successPayment(order_id)
            return 'PAYMENT STATUS: CREDIT CARD ACCEPTED'
          }
        } else if (transaction_status == 'settlement') {
          // TODO set transaction status on your databaase to 'success'
          await successPayment(order_id)
          return 'PAYMENT STATUS : SETTLEMENT'
        } else if (transaction_status == 'deny') {
          // TODO you can ignore 'deny', because most of the time it allows payment retries
          // and later can become success
        } else if (
          transaction_status == 'cancel' ||
          transaction_status == 'expire'
        ) {
          // TODO set transaction status on your databaase to 'failure'
          await Transaction.findOneAndUpdate(
            { _id: order_id },
            { paymentStatus: 'FAILED' }
          )
          return 'PAYMENT STATUS: FAILED OR EXPIRED'
        } else if (transaction_status == 'pending') {
          // TODO set transaction status on your databaase to 'pending' / waiting payment
          await Transaction.findOneAndUpdate(
            { _id: order_id },
            { paymentStatus: 'PENDING' }
          )
          return 'PAYMENT STATUS: PENDING'
        }
      })
  } catch (err) {
    throw err
  }
}

const successPayment = async (order_id) => {
  try {
    const expiredAt = new Date()
    expiredAt.setDate(expiredAt.getDate() + 1)

    const { chatRoomId } = await Transaction.findOneAndUpdate(
      { _id: order_id },
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
