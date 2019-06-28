const router = require('koa-router')()
const fileUtil = require('../utils/fileUtil')

router.prefix('/file')

router.get('/', async (ctx, next) => {
  const { path } = ctx.query
  const result = await fileUtil.listDir(path)
  ctx.body = result
})

module.exports = router
