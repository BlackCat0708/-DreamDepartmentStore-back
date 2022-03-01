import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  // 創作者 user.id
  illustrator: {
    type: mongoose.ObjectId,
    ref: 'users',
    required: [true, '創作者的id不能空白']
  },
  // 名稱
  name: {
    type: String,
    required: [true, '委託項目名稱不能空白']
  },
  // 價格
  price: {
    type: Number,
    required: [true, '價格不能空白']
  },
  // 範例圖
  images: {
    type: [String],
    required: [true, '範例圖片不能空白']
  },
  // 標籤
  tags: {
    type: [String]
  },
  // 尺寸規格
  size: {
    type: String
  },
  // 形式規格
  mode: {
    type: String
  },
  // 預計交期
  deadline: {
    type: String
  },
  // 授權範圍
  authorize: {
    type: [String]
    // enum: {
    //   values: ['個人收藏使用', '可縮放裁切', '可二次加工', '可註明出處後發布', '可不註明出處發布', '可平面印刷', '可製作成立體製品(徽章/立牌/吊飾)'],
    //   message: '授權範圍不存在'
    // }
  },
  // 委託流程
  process: {
    type: String
  },
  // 修改次數
  modification: {
    type: String
  },
  // 付款方式
  payment: {
    type: String,
    required: [true, '付款方式不能空白']
  },
  // 委託的注意事項
  notice: {
    type: String
  },
  sell: {
    type: Boolean,
    default: false
  }
}, { versionKey: false })

export default mongoose.model('products', productSchema)
