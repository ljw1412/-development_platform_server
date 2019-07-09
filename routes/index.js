const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  ctx.body = '研发管理平台服务已启动'
})

module.exports = router
