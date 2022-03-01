import products from '../models/products.js'

export const create = async (req, res) => {
  try {
    const result = await products.create({ ...req.body, illustrator: req.user._id, images: req.files.map(file => file.path) })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

// 改成下方搜尋 searchProducts
// export const getProducts = async (req, res) => {
//   try {
//     const result = await products.find({ sell: true }).populate('illustrator')
//     res.status(200).send({ success: true, message: '', result })
//   } catch (error) {
//     res.status(500).send({ success: false, message: '伺服器錯誤' })
//   }
// }

export const getMyProducts = async (req, res) => {
  try {
    const result = await products.find({ illustrator: req.user._id })
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

export const getUserProducts = async (req, res) => {
  try {
    const result = await products.find({ illustrator: req.params.id }).find({ sell: true }).populate('illustrator')
    if (result) {
      res.status(200).send({ success: true, message: '', result })
    } else {
      res.status(404).send({ success: false, message: '找不到' })
    }
  } catch (error) {
    if (error.name === 'CastError') {
      console.log(error)
      res.status(404).send({ success: false, message: '找不到' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const getAllProducts = async (req, res) => {
  try {
    const query = {
      $and: [
      ]
    }

    if (req.query.keywords) {
      const keywords = req.query.keywords.split(',').map(keyword => {
        return new RegExp(keyword, 'i')
      })
      query.$and.push({
        $or: [
          {
            tags: {
              $in: keywords
            }
          },
          {
            name: {
              $in: keywords
            }
          }
        ]
      })
    }
    if (query.$and.length === 0) {
      delete query.$and
    }

    const result = await products.find(query).populate('illustrator')
    res.status(200).send({ success: false, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const searchProducts = async (req, res) => {
  try {
    const query = {
      $and: [
      ]
    }

    if (req.query.authorize) {
      query.$and.push({ authorize: req.query.authorize })
    }

    if (req.query.price_gte) {
      if (isNaN(req.query.price_gte)) {
        res.status(400).send({ success: false, message: '格式錯誤' })
        return
      } else {
        query.$and.push({ price: { $gte: parseInt(req.query.price_gte) } })
      }
    }

    if (req.query.price_lte) {
      if (isNaN(req.query.price_lte)) {
        res.status(400).send({ success: false, message: '格式錯誤' })
        return
      } else {
        query.$and.push({ price: { $lte: parseInt(req.query.price_lte) } })
      }
    }

    if (req.query.keywords) {
      const keywords = req.query.keywords.split(',').map(keyword => {
        return new RegExp(keyword, 'i')
      })
      query.$and.push({
        $or: [
          {
            tags: {
              $in: keywords
            }
          },
          {
            name: {
              $in: keywords
            }
          }
        ]
      })
    }
    if (query.$and.length === 0) {
      delete query.$and
    }

    const result = await products.find(query).find({ sell: true }).populate('illustrator')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ sucess: false, message: '伺服器錯誤' })
  }
}

export const getProductById = async (req, res) => {
  try {
    const result = await products.findById(req.params.id).populate('illustrator')
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

export const updateProductById = async (req, res) => {
  const data = {
    name: req.body.name,
    price: req.body.price,
    tags: req.body.tags,
    size: req.body.size,
    mode: req.body.mode,
    deadline: req.body.deadline,
    authorize: req.body.authorize,
    process: req.body.process,
    modification: req.body.modification,
    payment: req.body.payment,
    notice: req.body.notice,
    sell: req.body.sell
  }

  if (req.files.length > 0) {
    data.images = req.files.map(file => file.path)
  }

  try {
    const result = await products.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })
    res.status(200).send({ success: true, message: '', result })
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

export const deleteProduct = async (req, res) => {
  try {
    const result = await products.findByIdAndDelete(req.params.id)
    if (result === null) {
      res.status(404).send({ success: false, message: '找不到資料' })
    } else {
      res.status(200).send({ success: true, message: '' })
    }
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
