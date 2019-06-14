const router = require('koa-router')()
const dbHelper = require('../helper/dbHelper')
const User = dbHelper.getModel('User')

router.prefix('/users')

router.get('/add', async (ctx, next) => {
  const { username, password } = ctx.query
  if (username && password) {
    await User.findOne({ username })
      .then(user =>
        user
          ? Promise.reject({ error: `username ${username} is exits` })
          : User.create({ username, password })
      )
      .then(() => {
        ctx.body = { message: `user ${username} create success.` }
      })
      .catch(err => {
        ctx.body = err
      })
  } else {
    ctx.body = { error: 'plase input username or password' }
    // ctx.throw(500, `plase input username or password`)
  }
})

router.post('/login', async (ctx, next) => {
  const { username, password } = ctx.request.body
  await User.findOne({ username, password })
    .then(
      user => user || Promise.reject({ error: 'username or password error' })
    )
    .then(user => {
      ctx.body = user
    })
    .catch(err => {
      ctx.body = err
    })
})

router.get('/bar', function(ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
