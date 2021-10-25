const mongoose = require('mongoose')
const Schema = mongoose.Schema

const contractPlanSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: [1, 'Title can not be less than 1 character'],
    maxlength: [20, 'Title can not be more than 20 character'],
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  consultantId: {
    type: Schema.Types.ObjectId,
    ref: 'Consultant',
  },
})

module.exports = mongoose.model('ContractPlan', contractPlanSchema)
