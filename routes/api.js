const router = require('koa-router')()
const mongoose = require('mongoose')
const Menu = mongoose.model('Menu')
const config = require('../config')

router.prefix('/api')

router.post('/reset_menu', async ctx => {
  const result = {}
  try {
    await Menu.reset()
    result.message = '重新生成成功'
  } catch (error) {
    result.error = error.message
  }
  ctx.body = result
})

router.get('/list_all_menu', async ctx => {
  await Menu.init()
  const menuList = await Menu.find({})
  ctx.body = menuList
})

module.exports = router
