const router = require('koa-router')()
const mongoose = require('mongoose')
const Menu = mongoose.model('Menu')

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
  const menuList = await Menu.find({}).sort({ _id: 1 })
  ctx.body = menuList
})

module.exports = router
