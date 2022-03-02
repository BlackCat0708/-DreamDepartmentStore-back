import express from 'express'
import content from '../middleware/content.js'
import auth from '../middleware/auth.js'
import user from '../middleware/user.js'
import illustrator from '../middleware/illustrator.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'

import {
  create,
  getMyOrders,
  getMyAcceptOrders,
  getMyCancelOrders,
  getMyFinishedOrders,
  getIllustratorOrders,
  getIllustratorDoingOrders,
  getIllustratorCancelOrders,
  getIllustratorFinishedOrders,
  getAllOrders,
  acceptOrder,
  cancelOrder,
  finishOrder,
  reviewOrder,
  getReviews
} from '../controllers/orders.js'

const router = express.Router()

router.post('/', auth, user, content('multipart/form-data'), upload, create)
// 委託者訂單資料
router.get('/me', auth, user, getMyOrders)
router.get('/me/accept', auth, user, getMyAcceptOrders)
router.get('/me/cancel', auth, user, getMyCancelOrders)
router.get('/me/finished', auth, user, getMyFinishedOrders)
// 創作者訂單資料
router.get('/illustrator', auth, illustrator, getIllustratorOrders)
router.get('/illustrator/doing', auth, illustrator, getIllustratorDoingOrders)
router.get('/illustrator/cancel', auth, illustrator, getIllustratorCancelOrders)
router.get('/illustrator/finished', auth, illustrator, getIllustratorFinishedOrders)
router.patch('/accept/:id', auth, illustrator, acceptOrder)
router.patch('/cancel/:id', auth, illustrator, cancelOrder)
router.patch('/finish/:id', auth, illustrator, finishOrder)
router.patch('/review/:id', auth, user, reviewOrder)
// 管理員訂單資料
router.get('/all', auth, admin, getAllOrders)
router.get('/:id', getReviews)

export default router
