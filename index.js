import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import usersRouter from './routes/users.js'
import productsRouter from './routes/products.js'
import questionsRouter from './routes/questions.js'
import ordersRouter from './routes/orders.js'

mongoose.connect(process.env.DB_URL, () => {
  console.log('MondoDB Connected')
})

const app = express()

// 檢查使用者有沒有 cors 的權限
app.use(cors({
  origin (origin, callback) {
    // 請求來源 origin === undefined 是 postman
    if (origin === undefined || origin.includes('github') || origin.includes('localhost')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed'), false)
    }
  }
}))

// 處理上面 cors 的錯誤
app.use((_, req, res, next) => {
  res.status(403).send({ success: false, message: '請求被拒絕' })
})

// 把 post 的 body 處理成 json 的格式
app.use(express.json())
// 如果 json 的格式不符
app.use((_, req, res, next) => {
  res.status(400).send({ success: false, message: '資料格式錯誤' })
})

// 判斷路徑開頭，如果符合的話，會進入後面設定的 router
app.use('/users', usersRouter)
app.use('/products', productsRouter)
app.use('/questions', questionsRouter)
app.use('/orders', ordersRouter)

// 如果上面的路徑都不符合，會進到404頁面
app.all('*', (req, res) => {
  res.status(404).send({ success: false, message: '找不到' })
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Server Started')
})
