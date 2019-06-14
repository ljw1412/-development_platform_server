const router = require('koa-router')()
const dbHelper = require('../helper/dbHelper')
const encryptionUtil = require('../utils/encryptionUtil')
const User = dbHelper.getModel('User')

router.prefix('/users')

router.get('/add', async (ctx, next) => {
  const { username, password, email } = ctx.query
  if (username && password && email) {
    const users = await User.find({ $or: [{ username }, { email: username }] })
    // await User.findOne({ username })
    //   .then(user =>
    //     user
    //       ? Promise.reject({ error: `username ${username} is exits` })
    //       : User.create({ username, password })
    //   )
    //   .then(() => {
    //     ctx.body = { message: `user ${username} create success.` }
    //   })
    //   .catch(err => {
    //     ctx.body = err
    //   })
  } else {
    ctx.body = { error: 'plase input username or password' }
    // ctx.throw(500, `plase input username or password`)
  }
})

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
