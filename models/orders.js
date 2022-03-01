import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'users'
  },
  product: {
    type: mongoose.ObjectId,
    ref: 'products',
    required: [true, '缺少商品 ID']
  },
  // 委託時間
  date: {
    type: Date,
    default: Date.now
  },
  // 取消狀態
  cancel: {
    type: Boolean
  },
  // 取消原因
  reason: {
    type: String
  },
  // 完成狀態
  finish: {
    type: Boolean
  },
  // 評論
  review: {
    type: String
  },
  // 評價
  star: {
    type: Number
  }
}, { versionKey: false })

export default mongoose.model('order', orderSchema)
