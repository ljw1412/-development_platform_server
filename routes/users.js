const router = require('koa-router')()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Role = mongoose.model('Role')
const config = require('../config')
const encryptionUtil = require('../utils/encryptionUtil')
const jwt = require('jsonwebtoken')

router.prefix('/users')

/**
 * 检查是否存在
 */
router.get('/check', async ctx => {
  const { prop, value } = ctx.query
  const isExists = await User.checkExists(prop, value)
  ctx.body = { isExists }
})

/**
 * 注册
 */
router.put('/register', async (ctx, next) => {
  const result = await User.register(ctx.request.body)
  ctx.body = result
})

/**
 * 登陆
 */
router.post('/login', async (ctx, next) => {
  const { username, password } = ctx.request.body
  const result = await User.login(username, password)
  ctx.body = result
})

router.get('/list', async ctx => {
  const { size, index, keyword } = ctx.query
  const users = await User.listByKeyword(size, index, keyword)
  const roles = await Role.find({})
  ctx.body = users.map(user => {
    user = user.toObject()
    const role = roles.find(item => item.id == user.role)
    if (role) user.role = role.name
    return user
  })
})

module.exports = router
