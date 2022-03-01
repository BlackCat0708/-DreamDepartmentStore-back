import express from 'express'
import content from '../middleware/content.js'
import auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import illustrator from '../middleware/illustrator.js'
import upload from '../middleware/upload.js'
import {
  create,
  // getProducts,
  getMyProducts,
  getUserProducts,
  getAllProducts,
  searchProducts,
  getProductById,
  updateProductById,
  deleteProduct
} from '../controllers/products.js'

const router = express.Router()

router.post('/', auth, illustrator, content('multipart/form-data'), upload, create)
// 全部上架的商品
// router.get('/', getProducts)
// 創作者能看到自己所有商品
router.get('/me', auth, illustrator, getMyProducts)
// 會員的商品
router.get('/user/:id', getUserProducts)
// 管理員能看的所有上架下架商品
router.get('/all', auth, admin, getAllProducts)
// 搜尋全部上架商品
router.get('/', searchProducts)
// 用委託項目的 id 查商品
router.get('/:id', getProductById)
// 創作者可以更新自己的商品
router.patch('/:id', auth, illustrator, content('multipart/form-data'), upload, updateProductById)
router.delete('/:id', auth, illustrator, deleteProduct)

export default router
