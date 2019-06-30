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
 * 更新
 */
router.put('/update', async ctx => {
  const result = await User.updateUser(ctx.request.body)
  ctx.body = result
})

router.delete('/:id', async ctx => {
  const id = ctx.params.id
  let result = {}
  try {
    result = await User.findByIdAndDelete(ctx.params.id)
  } catch (error) {
    result.error = `delete id ${id} fail.`
  }
  ctx.body = result
})

router.get('/user_info', async ctx => {
  let user = await User.findById(ctx.currentUser.id, {
    password: 0,
    salt: 0
  })
  const roles = await Role.find({})
  const role = roles.find(item => item.id == user.role)
  if (role) {
    user = user.toObject()
    user.roleName = role.name
  }
  ctx.body = user
})

/**
 * 登陆
 */
router.post('/login', async (ctx, next) => {
  const { username, password } = ctx.request.body
  const result = await User.login(username, password)
  ctx.body = result
})

/**
 * 用户列表
 */
router.get('/list', async ctx => {
  const { size, index, keyword } = ctx.query
  const users = await User.listByKeyword(size, index, keyword)
  const roles = await Role.find({})
  ctx.body = users.map(user => {
    user = user.toObject()
    const role = roles.find(item => item.id == user.role)
    if (role) {
      user.roleName = role.name
      user.isSuperAdmin = role.tag === 'superadmin'
    }
    return user
  })
})

module.exports = router
