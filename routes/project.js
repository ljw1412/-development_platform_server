const router = require('koa-router')()
const Project = require('../serves/database/models/Project')
const ObjectUtil = require('../utils/objectUtil')

router.prefix('/project')

router.get('/list', async (ctx, next) => {
  ctx.body = await Project.find()
})

router.get('/details', async (ctx, next) => {
  const { id } = ctx.query
  ctx.body = await Project.findById(id)
})

router.put('/save', async ctx => {
  const project = ObjectUtil.only(
    ctx.request.body,
    'name origin git path description'
  )
  const result = await Project.insertOrUpdateProject(project)
  ctx.body = result
})

module.exports = router
