const mongoose = require('mongoose')
const Schema = mongoose.Schema

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxlength: [50, 'Title can not be more than 50 characters'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Article', articleSchema)
