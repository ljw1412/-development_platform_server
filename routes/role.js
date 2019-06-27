const router = require('koa-router')()
const fileUtil = require('../utils/fileUtil')
const mongoose = require('mongoose')
const Role = mongoose.model('Role')

router.prefix('/roles')

router.get('/list', async (ctx, next) => {
  const roles = await Role.find({ isHide: { $not: { $eq: true } } })
  ctx.body = roles
})

module.exports = router
