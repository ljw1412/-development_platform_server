const router = require('koa-router')()
const fileUtil = require('../utils/fileUtil')

router.prefix('/file')

router.get('/', async (ctx, next) => {
  let { path, onlyDir } = ctx.query
  onlyDir = onlyDir === 'true'
  const result = await fileUtil.listDir({ path, onlyDir })
  ctx.body = result
})

module.exports = router
