import express from 'express'
import content from '../middleware/content.js'
import auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import {
  mail,
  getQuestions
} from '../controllers/questions.js'

const router = express.Router()

router.post('/', content('multipart/form-data'), upload, mail)
router.get('/', auth, admin, getQuestions)

export default router
