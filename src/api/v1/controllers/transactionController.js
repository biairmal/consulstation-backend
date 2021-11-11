const { transactionServices } = require('../services')

exports.createTransaction = async (req, res) => {
  try {
    const form = req.body
    const user = req.user

    if (user.role !== 'user') {
      return res.status(400).json({
        success: false,
        message: 'Failed to create transaction',
        errors: 'You do not have permissions to create transactions.',
      })
    }

    if (!form.chatRoomId) {
      return res.status(400).json({
        success: false,
        message: 'Failed to create transaction!',
        errors: 'Please fill chatRoomId field.',
      })
    }

    const data = await transactionServices.createTransaction(user, form)

    if (data === 'PAID') {
      return res.status(400).json({
        succes: false,
        message: 'Failed to create transaction!',
        errors: 'This chatroom has been paid and has not been expired.',
      })
    }

    return res.status(201).json({
      sucess: true,
      message: 'Successfully created a transaction!',
      data: data,
    })
  } catch (err) {
    console.log('Error', err)

    return res.status(500).json({
      success: false,
      message: 'Failed to create transaction!',
      errors: err,
    })
  }
}

exports.notify = async (req, res) => {
  try {
    const midtransNotification = req.body
    console.log(midtransNotification)

    const data = await transactionServices.notify(midtransNotification)

    return res.status(200).json({
      success: true,
      message: 'Successfully handled Midtrans notification!',
      data: data,
    })
  } catch (err) {
    console.log('Error', err)
    
    return res.status(500).json({
      success: false,
      message: 'Failed to handle Midtrans notification!',
      errors: err,
    })
  }
}
