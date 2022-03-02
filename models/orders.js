import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'users'
  },
  illustrator: {
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
  // 需求描述
  description: {
    type: String,
    required: [true, '缺少描述']
  },
  // 參考圖
  images: {
    type: [String]
  },
  // 參考來源
  source: {
    type: String
  },
  // 接受狀態
  accept: {
    type: Boolean,
    default: false
  },
  // 取消狀態
  cancel: {
    type: Boolean,
    default: false
  },
  // 取消原因
  reason: {
    type: String
  },
  // 完成狀態
  finish: {
    type: Boolean,
    default: false
  },
  // 匯款方式
  payment: {
    type: String
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
