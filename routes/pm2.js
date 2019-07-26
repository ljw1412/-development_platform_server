const router = require('koa-router')()
const pm2Util = require('../utils/pm2Util')
const fileUtil = require('../utils/fileUtil')
const moment = require('moment')

router.prefix('/pm2')

router.get('/list', async ctx => {
  let result = {}
  try {
    const list = await pm2Util.list()
    result.count = list.length
    result.list = list.map(item => ({
      pid: item.pid,
      name: item.name,
      pmid: item.pm_id,
      memory: fileUtil.formatFileSize(item.monit.memory),
      cpu: item.monit.cpu + '%',
      createTime: item.pm2_env.created_at,
      uptime: moment(item.pm2_env.pm_uptime).fromNow(true),
      restartTime: item.pm2_env.restart_time,
      status: item.pm2_env.status,
      version: item.pm2_env.version,
      watch: item.pm2_env.watch,
      path: item.pm2_env.pm_exec_path,
      protected: item.pm2_env.PWD === process.env.PWD
    }))
  } catch (error) {
    result.error = error
  }
  ctx.body = result
})

router.post('/action', async ctx => {
  let { id, type } = ctx.request.body
  console.log(type)
  if (type === 'start') type = 'reload'
  const proc = await pm2Util[type](id)
  ctx.body = proc
})

module.exports = router
