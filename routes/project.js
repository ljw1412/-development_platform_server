const router = require('koa-router')()
const Project = require('../serves/database/models/Project')
const ObjectUtil = require('../utils/objectUtil')
const GitUtil = require('../utils/gitUtil')
const config = require('../config')

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
  let result = { error: 'Not found project.' }
  if (project && project.state === 0) {
    if (config.ENABLE_GIT_CLONE) {
      result = await GitUtil.cloneRepository(project.path, project.git)
    } else {
      result = { message: '"git clone" is forbidden.' }
    }
    project.state = 2
    project.save()
  } else {
    result = { error: 'The project has been inited.' }
  }
  ctx.body = result
})

module.exports = router
