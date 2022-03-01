import mongoose from 'mongoose'
import md5 from 'md5'

const userSchema = new mongoose.Schema({
  account: {
    type: String,
    minlength: [4, '帳號必須 4 個字以上'],
    maxlength: [20, '帳號必須 20 個字以下'],
    unique: true,
    required: [true, '帳號欄位不能空白']
  },
  password: {
    type: String,
    required: [true, '密碼欄位不能空白']
  },
  role: {
    // 0 = 委託者
    // 1 = 創作者
    // 2 = 管理員
    type: Number,
    default: 0
  },
  tokens: {
    type: [String]
  },
  nickname: {
    type: String,
    minlength: [1, '暱稱必須 1 個字以上'],
    maxlength: [10, '暱稱必須 10 個字以下'],
    required: [true, '暱稱欄位不能空白']
  },
  // 大頭貼
  headshot: {
    type: String,
    default: 'https://res.cloudinary.com/duplahipf/image/upload/v1644562861/onzx0ae2fv5qab7ku7ls.png'
  },
  // 自我介紹
  selfIntroduction: {
    type: String,
    default: '大家好！'
  },
  // 社群媒體
  websites: {
    type: [
      {
        category: {
          type: String,
          enum: {
            values: ['個人網站', 'pixiv', 'Plurk', 'Twitter', 'Facebook', 'email', '其他'],
            message: '網站分類不存在'
          }
        },
        website: {
          type: String
        }
      }
    ]
  },
  // 相簿
  album: {
    type: [
      {
        image: {
          type: String
        },
        illustrator: {
          type: String
        }
      }
    ]
  },
  cabinet: {
    type: [
      {
        image: {
          type: String
        },
        illustrator: {
          type: String
        }
      }
    ]
  },
  yumejoshi: {
    type: [
      {
        image: {
          type: String
        },
        name: {
          type: String
        },
        introduction: {
          type: String
        }
      }
    ]
  },
  character: {
    type: [
      {
        image: {
          type: String
        },
        name: {
          type: String
        },
        introduction: {
          type: String
        }
      }
    ]
  },
  coverpicture: {
    type: String
  },
  coverIllustrator: {
    type: String
  }
}, { versionKey: false })

userSchema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = md5(user.password)
    } else {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidatorError({ message: '密碼長度錯誤' }))
      next(error)
      return
    }
  }
  next()
})

userSchema.pre('findOneAndUpdate', function (next) {
  const user = this._update
  if (user.password) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = md5(user.password)
    } else {
      const error = new mongoose.Error.ValidationError(null)
      error.addError('password', new mongoose.Error.ValidatorError({ message: '密碼長度錯誤' }))
      next(error)
      return
    }
  }
  next()
})

export default mongoose.model('users', userSchema)
