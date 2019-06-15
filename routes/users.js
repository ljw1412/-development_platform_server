const router = require('koa-router')()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const encryptionUtil = require('../utils/encryptionUtil')

router.prefix('/users')

/**
 * 检查是否存在
 */
router.get('/check', async ctx => {
  const { prop, value } = ctx.query
  const count = await User.countDocuments({ [prop]: value })
  ctx.body = { isExists: !!count }
})

/**
 * 注册
 */
router.post('/register', async (ctx, next) => {
  const { username, password, email } = ctx.request.body
  if (username && password && email) {
    const users = await User.find({ $or: [{ username }, { email: username }] })
    if (users.length) {
      ctx.body = { error: 'username or email has been used' }
    } else {
      await User.create({ username, password, email })
      ctx.body = { message: `user ${username} create success.` }
    }
  } else {
    ctx.body = { error: 'plase input username, password or email' }
    // ctx.throw(500, `plase input username or password`)
  }
})

/**
 * 登陆
 */
router.post('/login', async (ctx, next) => {
  const { username, password } = ctx.request.body
  const user = await User.findOne({ username })
  if (user) {
    if (user.password === password) ctx.body = user
    else ctx.body = { error: 'password error' }
  } else {
    ctx.body = { error: 'username or password error' }
  }
})

module.exports = router
