const router = require('koa-router')()
const mongoose = require('mongoose')
const Menu = mongoose.model('Menu')
const config = require('../config')

router.prefix('/api')

router.get('/list_all_menu', async ctx => {
  await Menu.init()
  const menuList = await Menu.find({})
  ctx.body = menuList
})

module.exports = router
