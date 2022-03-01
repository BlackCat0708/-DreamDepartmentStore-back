import md5 from 'md5'
import jwt from 'jsonwebtoken'
import users from '../models/users.js'

export const register = async (req, res) => {
  try {
    await users.create(req.body)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).send({ success: false, message: '帳號已存在' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const login = async (req, res) => {
  try {
    const user = await users.findOne(
      { account: req.body.account, password: md5(req.body.password) },
      '-password'
    )
    if (user) {
      const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET, { expiresIn: '7 days' })
      user.tokens.push(token)
      await user.save()
      const result = user.toObject()
      delete result.tokens
      result.token = token
      res.status(200).send({ success: true, message: '', result })
    } else {
      res.status(404).send({ success: false, message: '帳號或密碼錯誤' })
    }
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => token === req.token)
    const token = jwt.sign({ _id: req.user._id.toString() }, process.env.SECRET, { expiresIn: '7 days' })
    req.user.tokens[idx] = token
    req.user.markModified('tokens')
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: { token } })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getUserInfo = async (req, res) => {
  try {
    const result = req.user.toObject()
    delete result.tokens
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const updateUserInfo = async (req, res) => {
  const data = {
    nickname: req.body.nickname,
    selfIntroduction: req.body.selfIntroduction
  }

  if (req.file) {
    data.headshot = req.file.path
  }

  try {
    const result = await users.findByIdAndUpdate(req.user._id, data, { new: true, runValidators: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else if (error.name === 'ValidationError') {
      console.log(error)
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const addWebsite = async (req, res) => {
  try {
    const result = await users.findById(req.user._id)
    if (!result) {
      res.status(404).send({ success: false, message: '會員不存在' })
      return
    }
    req.user.websites.push(req.body)
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: req.user.websites[req.user.websites.length - 1] })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const updateWebsite = async (req, res) => {
  try {
    await users.findOneAndUpdate({ _id: req.user._id, 'websites._id': req.body._id },
      {
        $set: {
          'websites.$.category': req.body.category,
          'websites.$.website': req.body.website
        }
      },
      { new: true })
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const deleteWebsite = async (req, res) => {
  try {
    await users.findOneAndUpdate(
      { _id: req.user._id },
      {
        $pull: {
          websites: {
            _id: req.params.id
          }
        }
      },
      { new: true }
    )
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const addAlbum = async (req, res) => {
  try {
    const result = await users.findById(req.user._id)
    if (!result) {
      res.status(404).send({ success: false, message: '會員不存在' })
      return
    }
    req.user.album.push({ ...req.body, image: req.file.path })
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: req.user.album[req.user.album.length - 1] })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else if (error.name === 'ValidationError') {
      console.log(error)
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const updateAlbum = async (req, res) => {
  try {
    const data = {
      illustrator: req.body.illustrator,
      _id: req.body._id
    }

    if (req.file) {
      data.image = req.file.path
      await users.findOneAndUpdate({ _id: req.user._id, 'album._id': data._id },
        {
          $set: {
            'album.$.image': data.image
          }
        },
        { new: true })
    }

    const result = await users.findOneAndUpdate({ _id: req.user._id, 'album._id': data._id },
      {
        $set: {
          'album.$.illustrator': data.illustrator
        }
      },
      { new: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else if (error.name === 'ValidationError') {
      console.log(error)
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const deleteAlbum = async (req, res) => {
  try {
    await users.findOneAndUpdate(
      { _id: req.user._id },
      {
        $pull: {
          album: {
            _id: req.params.id
          }
        }
      },
      { new: true }
    )
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const addCabinet = async (req, res) => {
  try {
    const result = await users.findById(req.user._id)
    if (!result) {
      res.status(404).send({ success: false, message: '會員不存在' })
      return
    }
    req.user.cabinet.push({ ...req.body, image: req.file.path })
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: req.user.cabinet[req.user.cabinet.length - 1] })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else if (error.name === 'ValidationError') {
      console.log(error)
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const updateCabinet = async (req, res) => {
  try {
    const data = {
      illustrator: req.body.illustrator,
      _id: req.body._id
    }

    if (req.file) {
      data.image = req.file.path
      await users.findOneAndUpdate({ _id: req.user._id, 'cabinet._id': data._id },
        {
          $set: {
            'cabinet.$.image': data.image
          }
        },
        { new: true })
    }

    const result = await users.findOneAndUpdate({ _id: req.user._id, 'cabinet._id': data._id },
      {
        $set: {
          'cabinet.$.illustrator': data.illustrator
        }
      },
      { new: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else if (error.name === 'ValidationError') {
      console.log(error)
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const deleteCabinet = async (req, res) => {
  try {
    await users.findOneAndUpdate(
      { _id: req.user._id },
      {
        $pull: {
          cabinet: {
            _id: req.params.id
          }
        }
      },
      { new: true }
    )
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const getIllustrators = async (req, res) => {
  try {
    const query = {
      $and: []
    }

    if (req.query.keywords) {
      const keywords = req.query.keywords.split(',').map(keyword => {
        return new RegExp(keyword, 'i')
      })
      query.$and.push({
        $or: [
          {
            nickname: {
              $in: keywords
            }
          }
        ]
      })
    } else {
      delete query.$and
    }

    const result = await users.find(query).find({ role: 1 })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getUserById = async (req, res) => {
  try {
    const result = await users.findById(req.params.id)
    if (result) {
      res.status(200).send({ success: true, message: '', result })
    } else {
      res.status(404).send({ success: false, message: '找不到' })
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const addYumejoshiInfo = async (req, res) => {
  const data = {
    name: req.body.name,
    introduction: req.body.introduction
  }

  if (req.file) {
    data.image = req.file.path
  }

  try {
    const result = await users.findById(req.user._id)
    if (!result) {
      res.status(404).send({ success: false, message: '會員不存在' })
      return
    }
    req.user.yumejoshi.push(data)
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: req.user.yumejoshi[req.user.yumejoshi.length - 1] })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      console.log(error)
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else {
      console.log(error)
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const updateYumejoshiInfo = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      introduction: req.body.introduction
    }

    if (req.file) {
      data.image = req.file.path
      await users.findOneAndUpdate({ _id: req.user._id, 'yumejoshi._id': req.body._id },
        {
          $set: {
            'yumejoshi.$.image': data.image
          }
        })
    }

    await users.findOneAndUpdate({ _id: req.user._id, 'yumejoshi._id': req.body._id },
      {
        $set: {
          'yumejoshi.$.name': data.name,
          'yumejoshi.$.introduction': data.introduction
        }
      })
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const addCharacterInfo = async (req, res) => {
  const data = {
    name: req.body.name,
    introduction: req.body.introduction
  }

  if (req.file) {
    data.image = req.file.path
  }

  try {
    const result = await users.findById(req.user._id)
    if (!result) {
      res.status(404).send({ success: false, message: '會員不存在' })
      return
    }
    req.user.character.push(data)
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: req.user.character[req.user.character.length - 1] })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      console.log(error)
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else {
      console.log(error)
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const updateCharacterInfo = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      introduction: req.body.introduction
    }

    if (req.file) {
      data.image = req.file.path
      await users.findOneAndUpdate({ _id: req.user._id, 'character._id': req.body._id },
        {
          $set: {
            'character.$.image': data.image
          }
        })
    }

    await users.findOneAndUpdate({ _id: req.user._id, 'character._id': req.body._id },
      {
        $set: {
          'character.$.name': data.name,
          'character.$.introduction': data.introduction
        }
      })
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const updateCover = async (req, res) => {
  const data = {
    coverIllustrator: req.body.illustrator
  }

  if (req.file) {
    data.coverpicture = req.file.path
  }

  console.log(data)

  try {
    const result = await users.findByIdAndUpdate(req.user._id, data, { new: true, runValidators: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else if (error.name === 'ValidationError') {
      console.log(error)
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const query = {
      $and: []
    }

    if (req.query.keywords) {
      const keywords = req.query.keywords.split(',').map(keyword => {
        return new RegExp(keyword, 'i')
      })
      query.$and.push({
        $or: [
          {
            nickname: {
              $in: keywords
            }
          }
        ]
      })
    } else {
      delete query.$and
    }

    const result = await users.find(query)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const result = await users.findByIdAndDelete(req.params.id)
    if (result === null) {
      res.status(404).send({ success: false, message: '找不到資料' })
    } else {
      res.status(200).send({ success: true, message: '' })
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到資料' })
    } else {
      res.status(500).send({ success: false, message: '伺服器發生錯誤' })
    }
  }
}
