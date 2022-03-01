export default (req, res, next) => {
  if (req.user.role !== 2) {
    console.log(req)
    res.status(403).send({ success: false, message: '沒有權限' })
  } else {
    next()
  }
}
