const router = require('koa-router')()
const fileUtil = require('../utils/fileUtil')

router.prefix('/file')

router.get('/', async (ctx, next) => {
  const { path } = ctx.query
  const result = await fileUtil.listDir(path)
  ctx.body = result
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
