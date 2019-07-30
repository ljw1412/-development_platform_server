const router = require('koa-router')()
const pm2Util = require('../utils/pm2Util')

router.prefix('/pm2')

router.get('/list', async ctx => {
  let result = {}
  try {
    const list = await pm2Util.list()
    result.count = list.length
    result.list = list.map(item => pm2Util.formatProcessDescription(item))
  } catch (error) {
    result.error = error
  }
  ctx.body = result
})

router.post('/action', async ctx => {
  let { id, type } = ctx.request.body

  if (type === 'start') type = 'reload'
  let proc = await pm2Util[type](id)
  if (type === 'describe') proc = pm2Util.formatProcessDescription(proc[0])
  ctx.body = proc
})

router.get('/logs', async ctx => {
  let { id, lineNum } = ctx.query
  if (!lineNum) lineNum = -15
  ctx.body = await pm2Util.readLog(id, lineNum)
})

module.exports = router
