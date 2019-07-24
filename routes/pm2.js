const router = require('koa-router')()
const pm2Util = require('../utils/pm2Util')

router.prefix('/pm2')

router.get('/list', async ctx => {
  const { path } = ctx.query
  let result = {}
  try {
    result = await pm2Util.list(path)
  } catch (error) {
    result.error = error
  }
  ctx.body = result
})

module.exports = router
