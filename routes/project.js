const router = require('koa-router')()
const Project = require('../serves/database/models/Project')
const ObjectUtil = require('../utils/objectUtil')
const GitUtil = require('../utils/gitUtil')

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

router.get('/checkGitValid', async ctx => {
  const { url } = ctx.query
  ctx.body = await GitUtil.isVaildRepository(url)
})

router.post('/init', async ctx => {
  const { id } = ctx.request.body
  const project = await Project.findById(id)
  let result = { error: 'not found project.' }
  if (project) {
    result = await GitUtil.cloneRepository(project.path, project.git)
    project.state = 2
    project.save()
  }
  ctx.body = result
})

module.exports = router
