const router = require('koa-router')()
const systemUtil = require('../utils/systemUtil')

router.get('/', async (ctx, next) => {
  ctx.body = '研发管理平台服务已启动'
})

router.get('/system', async ctx => {
  const { action } = ctx.query
  const info = {}
  if (action === 'base') {
    Object.assign(info, {
      os: await systemUtil.getSystemVersion(),
      hostname: systemUtil.getHostname()
    })
  } else if (action === 'state') {
    Object.assign(info, {
      loadAvg: systemUtil.getLoadAvg(),
      uptime: systemUtil.getUptime(),
      memory: systemUtil.getMemory(),
      cpus: systemUtil.getCpu(),
      networkInterfaces: systemUtil.getNetworkInterfaces()
    })
  }
  ctx.body = info
})

module.exports = router
