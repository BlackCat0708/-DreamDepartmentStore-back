import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
  nickname: {
    type: String
  },
  account: {
    type: String
  },
  question: {
    type: String
  },
  content: {
    type: String
  },
  images: {
    type: [String]
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false })

export default mongoose.model('questions', questionSchema)
