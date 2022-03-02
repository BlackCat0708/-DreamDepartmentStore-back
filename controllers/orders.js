import orders from '../models/orders.js'

export const create = async (req, res) => {
  try {
    const result = await orders.create({ ...req.body, user: req.user._id, images: req.files.map(file => file.path) })
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

export const getMyOrders = async (req, res) => {
  try {
    const result = await orders.find({ user: req.user._id, payment: null, cancel: false }).populate('product').populate('illustrator')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getMyAcceptOrders = async (req, res) => {
  try {
    const result = await orders.find({ user: req.user._id, accept: true, finish: false }).populate('product').populate('illustrator')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getMyCancelOrders = async (req, res) => {
  try {
    const result = await orders.find({ user: req.user._id, cancel: true }).populate('product').populate('illustrator')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getMyFinishedOrders = async (req, res) => {
  try {
    const result = await orders.find({ user: req.user._id, finish: true }).populate('product').populate('illustrator')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getIllustratorOrders = async (req, res) => {
  try {
    const result = await orders.find({ illustrator: req.user._id, cancel: false, payment: null }).populate('product').populate('user')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getIllustratorCancelOrders = async (req, res) => {
  try {
    const result = await orders.find({ illustrator: req.user._id, cancel: true }).populate('product').populate('user')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getIllustratorDoingOrders = async (req, res) => {
  try {
    const result = await orders.find({ illustrator: req.user._id, accept: true, finish: false }).populate('product').populate('user')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getIllustratorFinishedOrders = async (req, res) => {
  try {
    const result = await orders.find({ illustrator: req.user._id, finish: true }).populate('product').populate('user')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const acceptOrder = async (req, res) => {
  const data = {
    payment: req.body.payment,
    accept: true
  }
  try {
    const result = await orders.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }).populate('product').populate('user')
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

export const cancelOrder = async (req, res) => {
  const data = {
    reason: req.body.reason,
    cancel: true
  }
  try {
    const result = await orders.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }).populate('product').populate('user')
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

export const finishOrder = async (req, res) => {
  const data = {
    finish: true
  }
  try {
    const result = await orders.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }).populate('product').populate('user')
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

export const reviewOrder = async (req, res) => {
  const data = {
    star: req.body.star, review: req.body.review
  }
  try {
    const result = await orders.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }).populate('product').populate('illustrator')
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

export const getAllOrders = async (req, res) => {
  try {
    const result = await orders.find().populate('user').populate('illustrator').populate('product')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getReviews = async (req, res) => {
  try {
    const result = await orders.find({ illustrator: req.params.id, finish: true }).populate('product').populate('user')
    res.status(200).send({ success: true, message: '', result })
    console.log(result)
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
