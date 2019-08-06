const router = require('koa-router')()
const fileUtil = require('../utils/fileUtil')

router.prefix('/file')

router.get('/list', async ctx => {
  let { path, onlyDir } = ctx.query
  onlyDir = onlyDir === 'true'
  const result = await fileUtil.listDir({ path, onlyDir })
  ctx.body = result
})

router.get('/exists', async ctx => {
  let { path } = ctx.query
  try {
    await fileUtil.isExists(path)
    ctx.body = true
  } catch (error) {
    ctx.body = false
  }
})

module.exports = router
