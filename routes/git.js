const router = require('koa-router')()
const GitUtil = require('../utils/gitUtil')
const util = require('util')
const execFile = util.promisify(require('child_process').execFile)

router.prefix('/git')

router.get('/checkValid', async ctx => {
  const { url } = ctx.query
  ctx.body = await GitUtil.isVaildRepository(url)
})

module.exports = router
