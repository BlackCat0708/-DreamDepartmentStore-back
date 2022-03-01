import express from 'express'
import content from '../middleware/content.js'
import auth from '../middleware/auth.js'
import singleUpload from '../middleware/singleUpload.js'
import user from '../middleware/user.js'
import admin from '../middleware/admin.js'

import {
  register,
  login,
  logout,
  extend,
  getUserInfo,
  updateUserInfo,
  addWebsite,
  updateWebsite,
  deleteWebsite,
  addAlbum,
  updateAlbum,
  deleteAlbum,
  addCabinet,
  updateCabinet,
  deleteCabinet,
  getIllustrators,
  getUserById,
  addYumejoshiInfo,
  updateYumejoshiInfo,
  addCharacterInfo,
  updateCharacterInfo,
  updateCover,
  getAllUsers,
  deleteUser
} from '../controllers/users.js'

const router = express.Router()

router.post('/', content('application/json'), register)
router.post('/login', content('application/json'), login)
router.post('/extend', auth, extend)
router.delete('/logout', auth, logout)
router.get('/me', auth, getUserInfo)
// 個人資料設定
router.patch('/myinfo', auth, content('multipart/form-data'), singleUpload, updateUserInfo)
// 網站設定
router.post('/websites', auth, addWebsite)
router.patch('/websites', auth, updateWebsite)
router.delete('/websites/:id', auth, deleteWebsite)
// 相簿設定
router.post('/album', auth, content('multipart/form-data'), singleUpload, addAlbum)
router.patch('/album', auth, content('multipart/form-data'), singleUpload, updateAlbum)
router.delete('/album/:id', auth, deleteAlbum)
// 衣櫃設定
router.post('/cabinet', auth, user, content('multipart/form-data'), singleUpload, addCabinet)
router.patch('/cabinet', auth, user, content('multipart/form-data'), singleUpload, updateCabinet)
router.delete('/cabinet/:id', auth, user, deleteCabinet)
// 所有創作者資料
router.get('/', getIllustrators)
// 所有用戶資料
router.get('/all', auth, admin, getAllUsers)
router.delete('/:id', auth, admin, deleteUser)
// 個人頁面
router.get('/:id', getUserById)
// 夢設設定
router.post('/yumejoshi', auth, user, content('multipart/form-data'), singleUpload, addYumejoshiInfo)
router.patch('/yumejoshi', auth, user, content('multipart/form-data'), singleUpload, updateYumejoshiInfo)
// 夢角設定
router.post('/character', auth, user, content('multipart/form-data'), singleUpload, addCharacterInfo)
router.patch('/character', auth, user, content('multipart/form-data'), singleUpload, updateCharacterInfo)
// 封面設定
router.patch('/cover', auth, user, content('multipart/form-data'), singleUpload, updateCover)
export default router
